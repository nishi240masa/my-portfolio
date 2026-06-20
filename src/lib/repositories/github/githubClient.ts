// GitHub Contents API への薄いクライアント
// - 環境変数: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH (default: develop)
// - fetch ベースで @octokit/rest 等の追加依存なし
// - retry は実装しない（必要になったら別PR）

const GITHUB_API = 'https://api.github.com';

export interface GitHubFile<T> {
  content: T;
  sha: string;
}

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

export async function getFile(filePath: string): Promise<GetFileResult> {
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

export async function putFile(
  filePath: string,
  content: string,
  sha: string | undefined,
  message: string,
): Promise<PutFileResult> {
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
    throw new Error(
      `GitHub putFile failed: ${res.status} ${res.statusText} (${filePath}) ${text}`,
    );
  }
  const json = (await res.json()) as { content?: { sha?: string } };
  const newSha = json.content?.sha;
  if (!newSha) {
    throw new Error(`GitHub putFile: missing sha in response for ${filePath}`);
  }
  return { sha: newSha };
}
