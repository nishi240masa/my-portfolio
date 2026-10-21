#!/usr/bin/env node
/**
 * edge bundle に CF Pages (workerd) で解決できない Node built-in が残っていないか検査する。
 *
 * 背景 (fix/admin-login-edge-node-fs):
 *   next.config.js は edge layer で `node:fs` / `node:path` を externals 扱いにしている。
 *   その `require("node:fs")` が edge function の bundle に 1 つでも残ると、
 *   @cloudflare/next-on-pages が chunk top-level の static `import * from "node:fs"` に変換し、
 *   workerd (compatibility_date 2025-01-20 では node:fs 未提供) がその chunk を読む
 *   function 全体を module load 時に `No such module "node:fs"` で落とす。
 *
 * 検査対象:
 *   1. `.next/server/middleware-manifest.json` の全 edge function (middleware 含む) が読む JS
 *      (`yarn build` 後に存在。CI の test job で実行する)
 *   2. `.vercel/output/static/_worker.js/` 配下 (`yarn build:cf` 後に存在する場合のみ)
 *
 * Usage:
 *   yarn build && node scripts/check-edge-bundle.mjs
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
// workerd (nodejs_compat, compatibility_date 2025-01-20) が提供しない module。
const FORBIDDEN = ['node:fs', 'node:fs/promises'];

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
// webpack externals: require("node:fs") / next-on-pages 変換後: from"node:fs" / import("node:fs")
const PATTERNS = FORBIDDEN.flatMap((m) => [
  new RegExp(`require\\(\\s*["']${escape(m)}["']\\s*\\)`),
  new RegExp(`from\\s*["']${escape(m)}["']`),
  new RegExp(`import\\(\\s*["']${escape(m)}["']\\s*\\)`),
]);

function findViolations(file) {
  const src = readFileSync(file, 'utf8');
  return PATTERNS.filter((re) => re.test(src)).map((re) => re.source);
}

function walkJs(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walkJs(p));
    else if (/\.(m?js)$/.test(name)) out.push(p);
  }
  return out;
}

const violations = [];
let checkedFiles = 0;

// 1. next build の edge function
const manifestPath = path.join(ROOT, '.next/server/middleware-manifest.json');
if (!existsSync(manifestPath)) {
  console.error(`error: ${path.relative(ROOT, manifestPath)} が無い。先に yarn build を実行すること`);
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const entries = [
  ...Object.entries(manifest.middleware ?? {}).map(([k, v]) => [`middleware ${k}`, v]),
  ...Object.entries(manifest.functions ?? {}),
];
const fileToRoutes = new Map();
for (const [route, def] of entries) {
  for (const f of def.files ?? []) {
    if (!f.endsWith('.js')) continue;
    const abs = path.join(ROOT, '.next', f);
    if (!existsSync(abs)) continue;
    if (!fileToRoutes.has(abs)) fileToRoutes.set(abs, []);
    fileToRoutes.get(abs).push(route);
  }
}
for (const [file, routes] of fileToRoutes) {
  checkedFiles++;
  const hits = findViolations(file);
  if (hits.length) violations.push({ file: path.relative(ROOT, file), routes, hits });
}

// 2. next-on-pages 出力 (存在する場合のみ)
const workerDir = path.join(ROOT, '.vercel/output/static/_worker.js');
if (existsSync(workerDir) && statSync(workerDir).isDirectory()) {
  for (const file of walkJs(workerDir)) {
    checkedFiles++;
    const hits = findViolations(file);
    if (hits.length) violations.push({ file: path.relative(ROOT, file), routes: [], hits });
  }
}

if (violations.length) {
  console.error(`edge bundle に ${FORBIDDEN.join(' / ')} の参照が残っている (${violations.length} files):`);
  for (const v of violations) {
    console.error(`  - ${v.file}`);
    if (v.routes.length) console.error(`      routes: ${v.routes.join(', ')}`);
    console.error(`      match:  ${v.hits.join(' | ')}`);
  }
  console.error(
    '\nedge runtime の route から node:fs 依存モジュール (例: src/lib/repositories/json/*) を引き込んでいないか確認すること。',
  );
  process.exit(1);
}

console.log(`ok: edge bundle (${entries.length} functions, ${checkedFiles} files) に ${FORBIDDEN.join(' / ')} の参照なし`);
