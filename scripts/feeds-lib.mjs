/**
 * scripts/fetch-feeds.mjs の純関数部分。
 * jest からテストできるよう、副作用 (fetch / fs / process.env 参照) を持たない関数だけを置く。
 */

export const MAX_ITEMS = 20;

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
