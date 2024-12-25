import { atom } from 'jotai';
import { loadable } from 'jotai/utils';

const data = [
  {
    id: 1,
    title: 'MD2S',
    image: 'https://west-m.net/MD2S.jpeg',
    peopleNum: 4,
    role: 'バックエンド',
    period: '8月12日〜8月20日:1週間',
    technologys: ['Golang', 'Docker', 'Kubernetes'],
    description:
      'QiitaやZennのような記事投稿・閲覧サイトを開発しました。また、記事をワンクリックでスライドに変換でき、作成したスライドも公開できる機能を実装しました。',
    date: '2024-02-01',
    tags: ['タグ1'],
    content: `
# このシステムについて
このシステムは **技育CAMP vol.18** で開発を行ったシステムです。
記事投稿サイトやスライド投稿サイトは数多くありますが、このシステムは **記事をスライドに変換する機能** を持っています。
また、スライドも公開できるため、スライドを作成する際に **Qiita** や **Zenn** に投稿する手間が省けます。
[Qiita](https://qiita.com/) や [Zenn](https://zenn.dev/) に投稿する手間が省けます。
`,
  },
  {
    id: 2,
    title: 'タイトル2',
    image: 'https://placehold.jp/150x150.png',
    peopleNum: 2,
    role: '役割2',
    period: '期間2',
    technologys: ['技術1', '技術2'],
    description: '説明2',
    date: '2024-10-02',
    tags: ['タグ1'],
    content: 'ここは本文です。',
  },
  {
    id: 3,
    title: 'タイトル3',
    image: 'https://placehold.jp/150x150.png',
    peopleNum: 3,
    role: '役割3',
    period: '期間3',
    technologys: ['技術1', '技術2'],
    description: '説明3',
    date: '2024-11-03',
    tags: ['タグ1', 'タグ2'],
    content: 'ここは本文です。',
  },
  {
    id: 4,
    title: 'タイトル4',
    image: 'https://placehold.jp/150x150.png',
    peopleNum: 4,
    role: '役割4',
    period: '期間4',
    technologys: ['技術1', '技術2'],
    description: '説明4',
    date: '2024-12-04',
    tags: ['タグ1', 'タグ2', 'タグ3'],
    content: 'ここは本文です。',
  },
  {
    id: 5,
    title: 'タイトル5',
    image: 'https://placehold.jp/150x150.png',
    peopleNum: 5,
    role: '役割5',
    period: '期間5',
    technologys: ['技術1', '技術2'],
    description: '説明5',

    tags: ['タグ1', 'タグ2', 'タグ3', 'タグ4'],
    content: 'ここは本文です。',
  },
];

const postAtom = atom(data);
export const postAtomLoadable = loadable(postAtom);
