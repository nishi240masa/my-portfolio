/**
 * Post に関する Jotai atom 定義
 * - NEXT_PUBLIC_USE_MOCK_DATA=true の場合はモックデータを使用
 * - それ以外の場合はバックエンド API を呼び出す
 */

import { atom } from 'jotai';
import { loadable } from 'jotai/utils';
import { API_CONFIG } from '@/config/api';
import { fetchPosts, fetchPostById } from '@/lib/api/posts';
import { fetchMockPosts, fetchMockPostById } from '@/lib/api/mock';
import type { Post, PostPage } from '@/types/post';

// ===========================
// 投稿一覧 atom
// ===========================

/**
 * 投稿一覧を取得する非同期 atom
 * useMockData フラグに応じてデータソースを切り替える
 */
const postsAsyncAtom = atom<Promise<Post[]>>(async () => {
  if (API_CONFIG.useMockData) {
    return fetchMockPosts();
  }
  return fetchPosts();
});

/** ローディング・エラー状態を扱える loadable atom */
export const postsAtomLoadable = loadable(postsAsyncAtom);

// ===========================
// 投稿詳細 atom ファクトリ
// ===========================

/**
 * 特定 ID の投稿詳細を取得する atom を生成する
 * @param id - 投稿 ID（文字列または数値）
 */
export function createPostDetailAtom(id: number | string) {
  return atom<Promise<PostPage | null>>(async () => {
    if (API_CONFIG.useMockData) {
      return fetchMockPostById(id);
    }
    try {
      return await fetchPostById(id);
    } catch {
      return null;
    }
  });
}

// ===========================
// 後方互換エイリアス（段階的移行用）
// ===========================

/**
 * @deprecated postAtomLoadable の代わりに postsAtomLoadable を使用してください
 */
export const postAtomLoadable = postsAtomLoadable;
