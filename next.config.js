/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // 必須
  experimental: {
    runtime: 'edge', // Edge Runtime を使用
  },
};

module.exports = nextConfig;