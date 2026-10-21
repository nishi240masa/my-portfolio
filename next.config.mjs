import { existsSync } from 'node:fs';
import path from 'node:path';
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// e2e 専用: FEEDS_FILE が指定された時だけ、/journal が静的 import する
// data/feeds.json (bot が日次更新する本番データ) を指定ファイルに差し替える。
// playwright.config.ts の webServer.env からのみ設定され、本番 build (未設定) は不変。
const feedsFileOverride = process.env.FEEDS_FILE
  ? path.resolve(process.cwd(), process.env.FEEDS_FILE)
  : null;
if (feedsFileOverride && !existsSync(feedsFileOverride)) {
  throw new Error(`FEEDS_FILE not found: ${feedsFileOverride}`);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'production.w3st.net',
      },
      {
        protocol: 'https',
        hostname: 'west-m.net',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 640, 750, 828, 960, 1080, 1200, 1600],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
    dangerouslyAllowSVG: false,
  },
  // 注: 以前は edge layer で `node:fs` / `node:path` を externals 扱いにしていたが、
  // PR #79 で json driver を `process.env.NEXT_RUNTIME !== 'edge'` 定数分岐により
  // edge bundle から除外したため不要になり削除した。edge bundle に node:fs が
  // 戻っていないことは scripts/check-edge-bundle.mjs (CI test job) が検査する。
  // edge build が node:fs の解決で落ちた場合は、externals を戻さず
  // import 経路 (edge route → node 専用 module) を断つこと。
  webpack: (config, { webpack }) => {
    if (feedsFileOverride) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/[\\/]data[\\/]feeds\.json$/, (resource) => {
          resource.request = feedsFileOverride;
        }),
      );
    }
    return config;
  },
};

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

export default nextConfig;
