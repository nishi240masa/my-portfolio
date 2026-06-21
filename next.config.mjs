import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

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
  // CF Pages Phase 2c: admin/api/admin ルートを edge runtime 化したことで、
  // `@/lib/repositories` barrel が lazy import している JSON driver
  // (`node:fs` / `node:path` 依存) を webpack edge ターゲットでも parse しよう
  // とし、UnhandledSchemeError が出る。
  //
  // JSON driver は **edge では絶対に呼ばれない**前提 (本番は REPOSITORY_DRIVER=github
  // 必須、edge は github driver のみ動作)。dynamic `await import()` chunk が
  // bundle に含まれること自体は許容するが、edge runtime の webpack が
  // `node:fs` / `node:path` を解決できずビルドが落ちるのを防ぐため、edge layer
  // でのみ `node:*` スキームを externals として扱う。
  //
  // 結果: build 通過 / edge bundle には外部参照が残るが、cloudflare workers では
  // 該当 module が解決できないため、もし json driver が誤って呼ばれた場合は明示的
  // に runtime error となる (REPOSITORY_DRIVER=github が必須)。
  webpack: (config, { nextRuntime }) => {
    if (nextRuntime === 'edge') {
      const existing = config.externals;
      const externalsArr = Array.isArray(existing) ? existing : existing ? [existing] : [];
      config.externals = [
        ...externalsArr,
        ({ request }, callback) => {
          if (request === 'node:fs' || request === 'node:path') {
            // commonjs 形式の外部参照 (edge target は dynamic import を許さないため module 形式は不可)
            return callback(null, 'commonjs ' + request);
          }
          return callback();
        },
      ];
    }
    return config;
  },
};

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

export default nextConfig;
