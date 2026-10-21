/**
 * @jest-environment node
 */
import {
  normalizeUser,
  resolveUsers,
  isOwnZennUrl,
  toZennItems,
  toQiitaItems,
  toGithubItems,
  filterOwnedExisting,
} from '../feeds-lib.mjs';

const rss = (links) =>
  `<?xml version="1.0"?><rss><channel>${links
    .map(
      (l, i) =>
        `<item><title><![CDATA[記事${i}]]></title><link>${l}</link><pubDate>Tue, 20 Oct 2026 00:00:00 GMT</pubDate></item>`,
    )
    .join('')}</channel></rss>`;

describe('normalizeUser / resolveUsers', () => {
  it.each([undefined, null, '', '   ', '\n\t'])('未設定扱い: %p', (v) => {
    expect(normalizeUser(v)).toBeNull();
  });

  it('前後空白を除去する', () => {
    expect(normalizeUser('  alice ')).toBe('alice');
  });

  it('全て未設定 / 空文字なら全サービス null (固定 fallback なし)', () => {
    expect(resolveUsers({})).toEqual({ zenn: null, qiita: null, github: null });
    expect(
      resolveUsers({ ZENN_USER: '', QIITA_USER: ' ', GITHUB_USER: '', USER_HANDLE: '' }),
    ).toEqual({ zenn: null, qiita: null, github: null });
  });

  it('USER_HANDLE が明示された場合のみ fallback する', () => {
    expect(resolveUsers({ ZENN_USER: '', USER_HANDLE: 'bob' })).toEqual({
      zenn: 'bob',
      qiita: 'bob',
      github: 'bob',
    });
    expect(resolveUsers({ ZENN_USER: 'alice', USER_HANDLE: 'bob' }).zenn).toBe('alice');
  });
});

describe('Zenn', () => {
  it('本人の URL だけを残す (トレンド混入を除外)', () => {
    const xml = rss([
      'https://zenn.dev/alice/articles/a1',
      'https://zenn.dev/someone/articles/x',
      'https://zenn.dev/Alice/articles/a2',
      'https://evil.example/alice/articles/a3',
      'not a url',
    ]);
    const items = toZennItems(xml, 'alice');
    expect(items.map((i) => i.url)).toEqual([
      'https://zenn.dev/alice/articles/a1',
      'https://zenn.dev/Alice/articles/a2',
    ]);
    expect(items[0]).toEqual({
      title: '記事0',
      url: 'https://zenn.dev/alice/articles/a1',
      publishedAt: 'Tue, 20 Oct 2026 00:00:00 GMT',
      source: 'zenn',
    });
  });

  it('ユーザー未設定なら全て除外', () => {
    expect(toZennItems(rss(['https://zenn.dev/alice/articles/a1']), null)).toEqual([]);
    expect(isOwnZennUrl('https://zenn.dev/alice/articles/a1', '')).toBe(false);
  });

  it('前方一致の別ユーザー (alice2) は除外', () => {
    expect(isOwnZennUrl('https://zenn.dev/alice2/articles/a', 'alice')).toBe(false);
  });
});

describe('Qiita', () => {
  it('user.id が一致する記事のみ', () => {
    const items = toQiitaItems(
      [
        { title: 'mine', url: 'https://qiita.com/alice/items/1', created_at: 'x', user: { id: 'alice' }, body: 'b' },
        { title: 'other', url: 'https://qiita.com/bob/items/2', user: { id: 'bob' } },
        { title: 'nouser', url: 'https://qiita.com/alice/items/3' },
      ],
      'alice',
    );
    expect(items).toEqual([
      { title: 'mine', url: 'https://qiita.com/alice/items/1', publishedAt: 'x', source: 'qiita', summary: 'b' },
    ]);
  });

  it('配列でなければ空', () => {
    expect(toQiitaItems({ message: 'Not found' }, 'alice')).toEqual([]);
  });
});

describe('GitHub', () => {
  it('owner.login 一致かつ fork / archived 以外のみ', () => {
    const base = { html_url: 'https://github.com/alice/r', stargazers_count: 3, language: 'TS' };
    const items = toGithubItems(
      [
        { ...base, full_name: 'alice/r', owner: { login: 'Alice' } },
        { ...base, full_name: 'bob/r', owner: { login: 'bob' } },
        { ...base, full_name: 'alice/f', owner: { login: 'alice' }, fork: true },
        { ...base, full_name: 'alice/a', owner: { login: 'alice' }, archived: true },
      ],
      'alice',
    );
    expect(items.map((i) => i.title)).toEqual(['alice/r']);
    expect(items[0].meta).toEqual({ stars: 3, language: 'TS' });
  });
});

describe('filterOwnedExisting', () => {
  it('既存値から他人のコンテンツを落とす', () => {
    const existing = [
      { title: 'a', url: 'https://zenn.dev/alice/articles/1', source: 'zenn' },
      { title: 'b', url: 'https://zenn.dev/hilopon/articles/2', source: 'zenn' },
    ];
    expect(filterOwnedExisting(existing, 'zenn', 'alice').map((i) => i.title)).toEqual(['a']);
    expect(filterOwnedExisting(existing, 'zenn', null)).toEqual([]);
    expect(
      filterOwnedExisting(
        [{ title: 'r', url: 'https://github.com/alice/r', source: 'github' }],
        'github',
        'alice',
      ),
    ).toHaveLength(1);
  });
});
