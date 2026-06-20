#!/usr/bin/env node
/**
 * data/feeds.json を更新するスクリプト。
 *
 * 外部サービス:
 *   - Zenn: RSS (https://zenn.dev/<user>/feed)
 *   - Qiita: REST API (https://qiita.com/api/v2/users/<user>/items)
 *   - GitHub: REST API (https://api.github.com/users/<user>/repos)
 *
 * env:
 *   ZENN_USER       — Zenn のユーザー名 (例: w3st)
 *   QIITA_USER      — Qiita のユーザー名
 *   GITHUB_USER     — GitHub のユーザー名
 *   USER_HANDLE     — 上記が未設定の場合のフォールバック
 *   GITHUB_TOKEN    — GitHub API のレート制限緩和用 (任意)
 *   FEEDS_OUT_FILE  — 出力先 (デフォルト: data/feeds.json)
 *
 * 失敗してもプロセスは 0 で終了し、取得済みのサービス分だけ書き出す。
 * (CI で一部 API がダウンしている時でも空配列で更新せず最新分を残せる)
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

const USER_FALLBACK = process.env.USER_HANDLE ?? 'w3st';
const ZENN_USER = process.env.ZENN_USER ?? USER_FALLBACK;
const QIITA_USER = process.env.QIITA_USER ?? USER_FALLBACK;
const GITHUB_USER = process.env.GITHUB_USER ?? USER_FALLBACK;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OUT_FILE = process.env.FEEDS_OUT_FILE
  ? path.resolve(process.env.FEEDS_OUT_FILE)
  : path.join(process.cwd(), 'data', 'feeds.json');

const MAX_ITEMS = 20;

async function safeFetchText(url, init) {
  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      console.error(`[fetch-feeds] ${url} -> HTTP ${res.status}`);
      return null;
    }
    return await res.text();
  } catch (e) {
    console.error(`[fetch-feeds] ${url} -> ${e.message}`);
    return null;
  }
}

async function safeFetchJson(url, init) {
  const text = await safeFetchText(url, init);
  if (text == null) return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error(`[fetch-feeds] JSON parse error for ${url}: ${e.message}`);
    return null;
  }
}

/**
 * 雑な RSS パーサ。XML パーサを引かずに <item>...</item> を切り出して
 * 主要フィールドだけ抽出する。RSS が壊れていれば空配列を返す。
 */
function parseRssItems(xml) {
  if (typeof xml !== 'string') return [];
  const items = [];
  const itemRe = /<item[\s\S]*?>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRe.exec(xml)) !== null && items.length < MAX_ITEMS) {
    const block = m[1];
    const pick = (tag) => {
      const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
      const mm = re.exec(block);
      if (!mm) return '';
      const raw = mm[1].trim();
      const stripped = raw
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
        .replace(/<[^>]+>/g, '')
        .trim();
      return stripped;
    };
    items.push({
      title: pick('title'),
      url: pick('link'),
      publishedAt: pick('pubDate') || null,
    });
  }
  return items;
}

async function fetchZenn(user) {
  const xml = await safeFetchText(`https://zenn.dev/${user}/feed`, {
    headers: { 'user-agent': 'portfolio-feeds-bot' },
  });
  if (xml == null) return [];
  return parseRssItems(xml).map((it) => ({
    title: it.title,
    url: it.url,
    publishedAt: it.publishedAt,
    source: 'zenn',
  }));
}

async function fetchQiita(user) {
  const json = await safeFetchJson(
    `https://qiita.com/api/v2/users/${encodeURIComponent(user)}/items?per_page=${MAX_ITEMS}`,
    { headers: { 'user-agent': 'portfolio-feeds-bot' } },
  );
  if (!Array.isArray(json)) return [];
  return json.slice(0, MAX_ITEMS).map((it) => ({
    title: String(it.title ?? ''),
    url: String(it.url ?? ''),
    publishedAt: it.created_at ?? null,
    source: 'qiita',
    summary: typeof it.body === 'string' ? it.body.slice(0, 140) : undefined,
  }));
}

async function fetchGithub(user) {
  const headers = {
    accept: 'application/vnd.github+json',
    'user-agent': 'portfolio-feeds-bot',
  };
  if (GITHUB_TOKEN) headers.authorization = `Bearer ${GITHUB_TOKEN}`;
  const json = await safeFetchJson(
    `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=${MAX_ITEMS}&sort=updated`,
    { headers },
  );
  if (!Array.isArray(json)) return [];
  // 自分のオリジナルリポジトリのみを残す (fork / archived は除外)。
  // ポートフォリオ目的では、外部の fork や凍結済みの古い置き場を出したくないため。
  const filtered = json.filter((repo) => repo && repo.fork !== true && repo.archived !== true);
  return filtered.slice(0, MAX_ITEMS).map((repo) => ({
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

async function loadExisting() {
  try {
    const text = await fs.readFile(OUT_FILE, 'utf8');
    return JSON.parse(text);
  } catch {
    return { zenn: [], qiita: [], github: [], updatedAt: null };
  }
}

async function main() {
  console.log(`[fetch-feeds] ZENN_USER=${ZENN_USER} QIITA_USER=${QIITA_USER} GITHUB_USER=${GITHUB_USER}`);
  const existing = await loadExisting();
  const [zenn, qiita, github] = await Promise.all([
    fetchZenn(ZENN_USER),
    fetchQiita(QIITA_USER),
    fetchGithub(GITHUB_USER),
  ]);

  // 失敗したセクションは既存値を残す
  const next = {
    zenn: zenn.length > 0 ? zenn : (existing.zenn ?? []),
    qiita: qiita.length > 0 ? qiita : (existing.qiita ?? []),
    github: github.length > 0 ? github : (existing.github ?? []),
    updatedAt: new Date().toISOString(),
  };

  // どのサービスが今回 0 件で「既存値フォールバック」になったかを stderr に集約サマリ出力。
  // CI ログから一目で「N services failed」を読み取れるようにする。
  const failed = [];
  if (zenn.length === 0) failed.push('zenn');
  if (qiita.length === 0) failed.push('qiita');
  if (github.length === 0) failed.push('github');
  if (failed.length > 0) {
    console.error(`[fetch-feeds] ${failed.length} services failed: ${failed.join(', ')}`);
  }

  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  await fs.writeFile(OUT_FILE, JSON.stringify(next, null, 2) + '\n', 'utf8');
  console.log(`[fetch-feeds] wrote ${OUT_FILE}`);
}

main().catch((e) => {
  console.error('[fetch-feeds] unexpected error', e);
  // 起動失敗で workflow をブロックしないため exit 0
  process.exit(0);
});
