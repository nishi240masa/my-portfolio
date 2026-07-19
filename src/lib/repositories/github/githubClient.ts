// GitHub Contents API への薄いクライアント
// - 環境変数: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH (default: develop)
// - fetch ベースで @octokit/rest 等の追加依存なし
// - putFile は 409 (sha 競合) のとき 1 回だけ sha を取り直して再試行する

const GITHUB_API = 'https://api.github.com';

export interface GitHubClientConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

export function getGitHubConfig(): GitHubClientConfig {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH ?? 'develop';
  if (!token || !owner || !repo) {
    throw new Error(
      'GitHub driver requires GITHUB_TOKEN, GITHUB_OWNER and GITHUB_REPO environment variables.',
    );
  }
  return { token, owner, repo, branch };
}

function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'my-portfolio-admin',
  };
}

// Node / Browser / Cloudflare Workers 全てで動作する base64 ヘルパ
function encodeBase64(text: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(text, 'utf8').toString('base64');
  }
  // Workers / browser
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function decodeBase64(b64: string): string {
  const cleaned = b64.replace(/\n/g, '');
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(cleaned, 'base64').toString('utf8');
  }
  const binary = atob(cleaned);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export interface GetFileResult {
  content: string; // 復号済み UTF-8
  sha: string;
}

export interface GetFileOptions {
  // 404 のとき throw せず null を返す（既存呼び出しは未指定なので throw のまま）
  allowNotFound?: boolean;
}

export async function getFile(filePath: string): Promise<GetFileResult>;
export async function getFile(
  filePath: string,
  options: { allowNotFound: true },
): Promise<GetFileResult | null>;
export async function getFile(
  filePath: string,
  options?: GetFileOptions,
): Promise<GetFileResult | null> {
  const cfg = getGitHubConfig();
  const url = `${GITHUB_API}/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(
    cfg.repo,
  )}/contents/${encodeURI(filePath)}?ref=${encodeURIComponent(cfg.branch)}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: authHeaders(cfg.token),
    cache: 'no-store',
  });
  if (!res.ok) {
    if (res.status === 404 && options?.allowNotFound) {
      return null;
    }
    const body = await res.text().catch(() => '');
    throw new Error(
      `GitHub getFile failed: ${res.status} ${res.statusText} (${filePath}) ${body}`,
    );
  }
  const json = (await res.json()) as { content?: string; sha?: string; encoding?: string };
  if (!json.sha || typeof json.content !== 'string') {
    throw new Error(`GitHub getFile: unexpected response shape for ${filePath}`);
  }
  const decoded = decodeBase64(json.content);
  return { content: decoded, sha: json.sha };
}

export interface PutFileResult {
  sha: string;
}

interface PutFileAttemptResult {
  ok: true;
  sha: string;
}

interface PutFileConflict {
  ok: false;
  status: number;
  body: string;
}

async function tryPutFile(
  filePath: string,
  content: string,
  sha: string | undefined,
  message: string,
): Promise<PutFileAttemptResult | PutFileConflict> {
  const cfg = getGitHubConfig();
  const url = `${GITHUB_API}/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(
    cfg.repo,
  )}/contents/${encodeURI(filePath)}`;

  const body: Record<string, unknown> = {
    message,
    content: encodeBase64(content),
    branch: cfg.branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      ...authHeaders(cfg.token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    if (res.status === 409 || res.status === 422) {
      // 409: sha conflict / 422: sha mismatch ともにリトライ対象
      return { ok: false, status: res.status, body: text };
    }
    throw new Error(
      `GitHub putFile failed: ${res.status} ${res.statusText} (${filePath}) ${text}`,
    );
  }
  const json = (await res.json()) as { content?: { sha?: string } };
  const newSha = json.content?.sha;
  if (!newSha) {
    throw new Error(`GitHub putFile: missing sha in response for ${filePath}`);
  }
  return { ok: true, sha: newSha };
}

// putFile: 409/422 (sha 競合) を検知した場合に 1 回だけ最新の sha を取り直して再試行する
// 注: これは「上書き競合」を完全に防ぐわけではないが、本ケース(admin 自己編集中の競合)の
// ほとんどは解消する短期解。長期的にはインタフェース拡張(eTag/optimistic lock)が必要。
// TODO: interface 拡張で呼び出し側に明示的なリトライ制御を委ねる
export async function putFile(
  filePath: string,
  content: string,
  sha: string | undefined,
  message: string,
): Promise<PutFileResult> {
  const first = await tryPutFile(filePath, content, sha, message);
  if (first.ok) return { sha: first.sha };

  // 競合: 最新の sha を取り直して 1 回だけ再試行
  const latest = await getFile(filePath);
  const retry = await tryPutFile(filePath, content, latest.sha, message);
  if (retry.ok) return { sha: retry.sha };
  throw new Error(
    `GitHub putFile failed after retry: ${retry.status} (${filePath}) ${retry.body}`,
  );
}
