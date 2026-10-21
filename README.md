This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy (Cloudflare Pages)

本番は **Cloudflare Pages** (`https://w3st.net`, project `west-portfolio`) で配信している。`main` への push で GitHub Actions の [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) が `yarn build:cf` (`@cloudflare/next-on-pages`) → `wrangler pages deploy .vercel/output/static` を実行する。Vercel ホスティングは廃止済 (devDependency の `vercel` は next-on-pages が内部で `vercel build` を使うため残している)。

全 dynamic route は edge runtime 化済で、本番のデータ層は `REPOSITORY_DRIVER=github` を使う。secrets / 環境変数の設定手順は [docs/CLOUDFLARE_PAGES_SETUP.md](docs/CLOUDFLARE_PAGES_SETUP.md) を参照。
