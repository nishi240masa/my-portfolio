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
 *   ZENN_USER       — Zenn のユーザー名
 *   QIITA_USER      — Qiita のユーザー名
 *   GITHUB_USER     — GitHub のユーザー名
 *   USER_HANDLE     — 上記が未設定の場合のフォールバック (明示された場合のみ)
 *   ※ 未設定 / 空文字 / 空白のみ のサービスは取得をスキップし空配列を書く。
 *     取得結果も本人 (URL / owner) のものだけに絞り、他人のコンテンツは取り込まない。
 *   GITHUB_TOKEN    — GitHub API のレート制限緩和用 (任意)
 *   FEEDS_OUT_FILE  — 出力先 (デフォルト: data/feeds.json)
 *
 * 失敗してもプロセスは 0 で終了し、取得済みのサービス分だけ書き出す。
 * (CI で一部 API がダウンしている時でも空配列で更新せず最新分を残せる)
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  resolveUsers,
  toZennItems,
  toQiitaItems,
  toGithubItems,
  filterOwnedExisting,
  zennFeedUrl,
  qiitaItemsUrl,
  githubReposUrl,
  formatFetchSummary,
} from './feeds-lib.mjs';

const USERS = resolveUsers(process.env);
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OUT_FILE = process.env.FEEDS_OUT_FILE
  ? path.resolve(process.env.FEEDS_OUT_FILE)
  : path.join(process.cwd(), 'data', 'feeds.json');

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

// fetch 関数は取得失敗時に null、成功時に FeedItem[] (0 件含む) を返す。
// 「取得失敗」と「取得成功だが 0 件」をログで区別するため。

async function fetchZenn(user) {
  const xml = await safeFetchText(zennFeedUrl(user), {
    headers: { 'user-agent': 'portfolio-feeds-bot' },
  });
  if (xml == null) return null;
  return toZennItems(xml, user);
}

async function fetchQiita(user) {
  const json = await safeFetchJson(qiitaItemsUrl(user), {
    headers: { 'user-agent': 'portfolio-feeds-bot' },
  });
  if (!Array.isArray(json)) {
    if (json != null) console.error(`[fetch-feeds] qiita: unexpected response (not an array)`);
    return null;
  }
  return toQiitaItems(json, user);
}

async function fetchGithub(user) {
  const headers = {
    accept: 'application/vnd.github+json',
    'user-agent': 'portfolio-feeds-bot',
  };
  if (GITHUB_TOKEN) headers.authorization = `Bearer ${GITHUB_TOKEN}`;
  const json = await safeFetchJson(githubReposUrl(user), { headers });
  if (!Array.isArray(json)) {
    if (json != null) console.error(`[fetch-feeds] github: unexpected response (not an array)`);
    return null;
  }
  return toGithubItems(json, user);
}

async function loadExisting() {
  try {
    const text = await fs.readFile(OUT_FILE, 'utf8');
    return JSON.parse(text);
  } catch {
    return { zenn: [], qiita: [], github: [], updatedAt: null };
  }
}

const SERVICES = [
  { key: 'zenn', env: 'ZENN_USER', fetch: fetchZenn },
  { key: 'qiita', env: 'QIITA_USER', fetch: fetchQiita },
  { key: 'github', env: 'GITHUB_USER', fetch: fetchGithub },
];

async function main() {
  console.log(
    `[fetch-feeds] ZENN_USER=${USERS.zenn ?? '(unset)'} QIITA_USER=${USERS.qiita ?? '(unset)'} GITHUB_USER=${USERS.github ?? '(unset)'}`,
  );
  const existing = await loadExisting();

  const next = { zenn: [], qiita: [], github: [], updatedAt: new Date().toISOString() };
  // ログの並びを完了順でなく SERVICES 順に固定するため先にキーを作っておく
  const results = Object.fromEntries(SERVICES.map(({ key }) => [key, 'pending']));
  await Promise.all(
    SERVICES.map(async ({ key, env, fetch: fetchItems }) => {
      const user = USERS[key];
      if (!user) {
        // ユーザー名未設定: 取得しない。既存値も引き継がず空配列にする
        // (他人のコンテンツを絶対に表示しないため)。
        console.log(`[fetch-feeds] skip ${key}: ${env} not set`);
        results[key] = 'skipped';
        next[key] = [];
        return;
      }
      const items = await fetchItems(user);
      if (items != null && items.length > 0) {
        results[key] = 'ok';
        next[key] = items;
        return;
      }
      // 失敗 (null) または 0 件は既存値を残す。ただし本人の URL のものだけ。
      // (挙動は両者同じ。ログだけ区別する)
      results[key] = items == null ? 'failed' : 'empty';
      next[key] = filterOwnedExisting(existing[key], key, user);
    }),
  );

  // 既存値フォールバックになったサービスを集約サマリ出力。
  // 取得失敗は stderr に「N services failed」、取得成功・0 件は stdout に別行で出す。
  const summary = formatFetchSummary(results);
  for (const line of summary.info) console.log(line);
  for (const line of summary.error) console.error(line);

  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  await fs.writeFile(OUT_FILE, JSON.stringify(next, null, 2) + '\n', 'utf8');
  console.log(`[fetch-feeds] wrote ${OUT_FILE}`);
}

main().catch((e) => {
  console.error('[fetch-feeds] unexpected error', e);
  // 起動失敗で workflow をブロックしないため exit 0
  process.exit(0);
});
