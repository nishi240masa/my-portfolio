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
  zennFeedUrl,
  qiitaItemsUrl,
  githubReposUrl,
  formatFetchSummary,
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

describe('filterOwnedExisting (サービス別 / URL 形式)', () => {
  it('Qiita: 本人の URL だけ残し、他人 / 別ホスト / http は落とす', () => {
    const existing = [
      { title: 'mine', url: 'https://qiita.com/alice/items/1', source: 'qiita' },
      { title: 'mine-case', url: 'https://qiita.com/ALICE/items/2', source: 'qiita' },
      { title: 'other', url: 'https://qiita.com/bob/items/3', source: 'qiita' },
      { title: 'zenn-host', url: 'https://zenn.dev/alice/articles/4', source: 'qiita' },
      { title: 'http', url: 'http://qiita.com/alice/items/5', source: 'qiita' },
      { title: 'prefix', url: 'https://qiita.com/alice2/items/6', source: 'qiita' },
      null,
    ];
    expect(filterOwnedExisting(existing, 'qiita', 'alice').map((i) => i.title)).toEqual([
      'mine',
      'mine-case',
    ]);
  });

  it('末尾スラッシュなし URL (https://github.com/alice) も本人分として残す', () => {
    const existing = [
      { title: 'profile', url: 'https://github.com/alice', source: 'github' },
      { title: 'zenn-profile', url: 'https://zenn.dev/alice', source: 'zenn' },
      { title: 'other', url: 'https://github.com/bob', source: 'github' },
    ];
    expect(filterOwnedExisting(existing, 'github', 'alice').map((i) => i.title)).toEqual([
      'profile',
    ]);
    expect(filterOwnedExisting(existing, 'zenn', 'alice').map((i) => i.title)).toEqual([
      'zenn-profile',
    ]);
    expect(isOwnZennUrl('https://zenn.dev/alice', 'alice')).toBe(true);
  });

  it('未知の source / 配列でない入力は空', () => {
    expect(filterOwnedExisting([{ url: 'https://qiita.com/alice/items/1' }], 'note', 'alice')).toEqual(
      [],
    );
    expect(filterOwnedExisting(undefined, 'qiita', 'alice')).toEqual([]);
  });
});

describe('特殊文字を含むユーザー名', () => {
  it('URL builder はユーザー名を encodeURIComponent してパス 1 セグメントに閉じ込める', () => {
    expect(zennFeedUrl('a/b?c#d')).toBe('https://zenn.dev/a%2Fb%3Fc%23d/feed');
    expect(zennFeedUrl('山田')).toBe('https://zenn.dev/%E5%B1%B1%E7%94%B0/feed');
    expect(qiitaItemsUrl('a/b')).toBe('https://qiita.com/api/v2/users/a%2Fb/items?per_page=20');
    expect(githubReposUrl('a b')).toBe(
      'https://api.github.com/users/a%20b/repos?per_page=20&sort=updated',
    );
    // パストラバーサル的な値でも別パスに抜けない
    expect(new URL(zennFeedUrl('../trend')).pathname).toBe('/..%2Ftrend/feed');
  });

  it('Zenn: パーセントエンコードされた本人 URL は decode して一致判定する', () => {
    const user = 'yamada_太郎';
    const ownUrl = `https://zenn.dev/${encodeURIComponent(user)}/articles/a1`;
    const items = toZennItems(rss([ownUrl, 'https://zenn.dev/yamada/articles/x']), user);
    expect(items.map((i) => i.url)).toEqual([ownUrl]);
  });

  it('Zenn: 不正なパーセントエンコードは本人扱いしない', () => {
    expect(isOwnZennUrl('https://zenn.dev/%E0%A4%A/articles/a', 'alice')).toBe(false);
  });
});

describe('formatFetchSummary', () => {
  it('0 件 (取得成功) と取得失敗を別の行で出す', () => {
    expect(
      formatFetchSummary({ zenn: 'empty', qiita: 'failed', github: 'ok' }),
    ).toEqual({
      info: ['[fetch-feeds] zenn: 0 items (fetched OK)'],
      error: ['[fetch-feeds] 1 services failed: qiita'],
    });
  });

  it('0 件だけなら failed 行は出さない', () => {
    expect(formatFetchSummary({ zenn: 'empty', qiita: 'ok', github: 'skipped' })).toEqual({
      info: ['[fetch-feeds] zenn: 0 items (fetched OK)'],
      error: [],
    });
  });

  it('複数失敗をまとめる / 全成功なら何も出さない', () => {
    expect(formatFetchSummary({ zenn: 'failed', qiita: 'failed', github: 'ok' }).error).toEqual([
      '[fetch-feeds] 2 services failed: zenn, qiita',
    ]);
    expect(formatFetchSummary({ zenn: 'ok', qiita: 'ok', github: 'ok' })).toEqual({
      info: [],
      error: [],
    });
    expect(formatFetchSummary(undefined)).toEqual({ info: [], error: [] });
  });
});
