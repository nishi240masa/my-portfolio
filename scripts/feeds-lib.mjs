/**
 * scripts/fetch-feeds.mjs の純関数部分。
 * jest からテストできるよう、副作用 (fetch / fs / process.env 参照) を持たない関数だけを置く。
 */

export const MAX_ITEMS = 20;

/** Zenn RSS の URL。ユーザー名は encodeURIComponent でパス 1 セグメントに閉じ込める。 */
export function zennFeedUrl(user) {
  return `https://zenn.dev/${encodeURIComponent(user)}/feed`;
}

/** Qiita ユーザー記事一覧 API の URL。 */
export function qiitaItemsUrl(user) {
  return `https://qiita.com/api/v2/users/${encodeURIComponent(user)}/items?per_page=${MAX_ITEMS}`;
}

/** GitHub ユーザーリポジトリ一覧 API の URL。 */
export function githubReposUrl(user) {
  return `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=${MAX_ITEMS}&sort=updated`;
}

/**
 * env 値をユーザー名として正規化する。
 * undefined / null / 空文字 / 空白のみ は「未設定」として null を返す。
 * (GitHub Actions の `${{ vars.X || secrets.X }}` は未登録時に空文字を渡すため、
 *  `??` では fallback されず `https://zenn.dev//feed` = トレンドフィードを取得してしまう)
 */
export function normalizeUser(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

/**
 * 各サービスのユーザー名を解決する。
 * サービス個別の env が未設定なら USER_HANDLE (明示された場合のみ) を使い、
 * どちらも無ければ null (= 取得をスキップ)。固定の既定ハンドルは持たない。
 */
export function resolveUsers(env) {
  const fallback = normalizeUser(env.USER_HANDLE);
  return {
    zenn: normalizeUser(env.ZENN_USER) ?? fallback,
    qiita: normalizeUser(env.QIITA_USER) ?? fallback,
    github: normalizeUser(env.GITHUB_USER) ?? fallback,
  };
}

function sameUser(a, b) {
  return typeof a === 'string' && typeof b === 'string' && a.toLowerCase() === b.toLowerCase();
}

/**
 * URL が指定ホストの `/<user>/` 配下かを判定する (ユーザー名は大文字小文字無視)。
 */
function isUnderUserPath(rawUrl, host, user) {
  if (!user || typeof rawUrl !== 'string') return false;
  let u;
  try {
    u = new URL(rawUrl);
  } catch {
    return false;
  }
  if (u.protocol !== 'https:' || u.hostname !== host) return false;
  const first = u.pathname.split('/')[1] ?? '';
  let decoded;
  try {
    decoded = decodeURIComponent(first);
  } catch {
    return false;
  }
  return sameUser(decoded, user);
}

/** Zenn の記事 URL が `https://zenn.dev/<user>/...` か */
export function isOwnZennUrl(url, user) {
  return isUnderUserPath(url, 'zenn.dev', user);
}

/**
 * 雑な RSS パーサ。XML パーサを引かずに <item>...</item> を切り出して
 * 主要フィールドだけ抽出する。RSS が壊れていれば空配列を返す。
 */
export function parseRssItems(xml) {
  if (typeof xml !== 'string') return [];
  const items = [];
  const itemRe = /<item[\s\S]*?>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1];
    const pick = (tag) => {
      const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
      const mm = re.exec(block);
      if (!mm) return '';
      return mm[1]
        .trim()
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
        .replace(/<[^>]+>/g, '')
        .trim();
    };
    items.push({
      title: pick('title'),
      url: pick('link'),
      publishedAt: pick('pubDate') || null,
    });
  }
  return items;
}

/** Zenn RSS → FeedItem[]。本人の URL 以外 (トレンド等) は除外する。 */
export function toZennItems(xml, user) {
  return parseRssItems(xml)
    .filter((it) => isOwnZennUrl(it.url, user))
    .slice(0, MAX_ITEMS)
    .map((it) => ({
      title: it.title,
      url: it.url,
      publishedAt: it.publishedAt,
      source: 'zenn',
    }));
}

/** Qiita API → FeedItem[]。`user.id` が一致しない記事は除外する。 */
export function toQiitaItems(json, user) {
  if (!Array.isArray(json) || !user) return [];
  return json
    .filter((it) => it && sameUser(it.user?.id, user))
    .slice(0, MAX_ITEMS)
    .map((it) => ({
      title: String(it.title ?? ''),
      url: String(it.url ?? ''),
      publishedAt: it.created_at ?? null,
      source: 'qiita',
      summary: typeof it.body === 'string' ? it.body.slice(0, 140) : undefined,
    }));
}

/**
 * GitHub API → FeedItem[]。`owner.login` が一致しないリポジトリは除外する。
 * 自分のオリジナルリポジトリのみを残す (fork / archived は除外)。
 * ポートフォリオ目的では、外部の fork や凍結済みの古い置き場を出したくないため。
 */
export function toGithubItems(json, user) {
  if (!Array.isArray(json) || !user) return [];
  return json
    .filter(
      (repo) =>
        repo && repo.fork !== true && repo.archived !== true && sameUser(repo.owner?.login, user),
    )
    .slice(0, MAX_ITEMS)
    .map((repo) => ({
      title: String(repo.full_name ?? repo.name ?? ''),
      url: String(repo.html_url ?? ''),
      publishedAt: repo.pushed_at ?? null,
      source: 'github',
      summary: repo.description != null ? String(repo.description).slice(0, 200) : undefined,
      meta: {
        stars: Number(repo.stargazers_count ?? 0),
        language: repo.language ?? null,
      },
    }));
}

/**
 * 取得失敗時に残す既存値の安全網。既存の feeds.json に他人のコンテンツが
 * 混入していても (過去の誤取得など) 引き継がないよう、URL で本人分だけに絞る。
 */
export function filterOwnedExisting(items, source, user) {
  if (!Array.isArray(items) || !user) return [];
  const host = { zenn: 'zenn.dev', qiita: 'qiita.com', github: 'github.com' }[source];
  if (!host) return [];
  return items.filter((it) => it && isUnderUserPath(it.url, host, user));
}

/**
 * 各サービスの取得結果からログ行を組み立てる。
 * results: { [key]: 'ok' | 'empty' | 'failed' | 'skipped' }
 *   - failed: HTTP エラー / ネットワークエラー / parse 失敗 / 想定外の形式
 *   - empty : 取得は成功したが本人の項目が 0 件
 * 「取得失敗」と「0 件」を同じ "failed" として出すと CI ログが紛らわしいため分けて出す。
 * (どちらも既存値 fallback する点は呼び出し側で同じ)
 * 戻り値: { info: string[], error: string[] } (info → stdout, error → stderr)
 */
export function formatFetchSummary(results) {
  const entries = Object.entries(results ?? {});
  const empty = entries.filter(([, s]) => s === 'empty').map(([k]) => k);
  const failed = entries.filter(([, s]) => s === 'failed').map(([k]) => k);
  const info = empty.map((k) => `[fetch-feeds] ${k}: 0 items (fetched OK)`);
  const error =
    failed.length > 0 ? [`[fetch-feeds] ${failed.length} services failed: ${failed.join(', ')}`] : [];
  return { info, error };
}
