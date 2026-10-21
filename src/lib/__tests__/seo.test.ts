import {
  BASE_OPEN_GRAPH,
  DEFAULT_OG_IMAGE,
  canonicalPath,
  pageMetadata,
} from '@/lib/seo';

describe('canonicalPath', () => {
  it.each([
    ['/home', '/home'],
    ['home', '/home'],
    ['/home/', '/home'],
    ['/articles/foo//', '/articles/foo'],
    ['//production//1', '/production/1'],
    ['/articles?page=2', '/articles'],
    ['/journal#latest', '/journal'],
    ['/', '/'],
    ['', '/'],
  ])('%p -> %p', (input, expected) => {
    expect(canonicalPath(input)).toBe(expected);
  });
});

describe('pageMetadata', () => {
  it('canonical と og:url が同じ正規化済みパスになる', () => {
    const meta = pageMetadata('/services/');
    expect(meta.alternates).toEqual({ canonical: '/services' });
    expect(meta.openGraph).toMatchObject({ url: '/services' });
  });

  it('root layout の openGraph 既定値と既定 OG 画像を補う', () => {
    const meta = pageMetadata('/home');
    expect(meta.openGraph).toMatchObject({
      ...BASE_OPEN_GRAPH,
      images: [DEFAULT_OG_IMAGE],
    });
  });

  it('ページ固有の openGraph で既定値を上書きできるが url は canonical 固定', () => {
    const meta = pageMetadata('/en', {
      openGraph: { locale: 'en_US', title: 'EN', url: '/wrong' },
    });
    expect(meta.openGraph).toMatchObject({
      locale: 'en_US',
      title: 'EN',
      siteName: BASE_OPEN_GRAPH.siteName,
      url: '/en',
    });
  });

  it('defaultOgImage: false なら images キー自体を持たない (file convention の画像を優先)', () => {
    const meta = pageMetadata('/production/1', {
      defaultOgImage: false,
      openGraph: { type: 'article', title: 'x' },
    });
    expect(meta.openGraph).not.toHaveProperty('images');
    expect(meta.openGraph).toMatchObject({ type: 'article', url: '/production/1' });
  });

  it('絶対 URL を含まない (metadataBase = NEXT_PUBLIC_SITE_URL で解決させる)', () => {
    const meta = pageMetadata('/articles/foo');
    expect(JSON.stringify(meta)).not.toMatch(/https?:\/\//);
  });
});
