/**
 * プロダクション（Posts）API
 */

import { API_ENDPOINTS } from '@/config/api';
import type {
  GetPostsResponse,
  GetPostByIdResponse,
  GetPostsParams,
  SearchPostsParams,
  ApiPost,
  ApiPostDetail,
} from '@/types/api';
import type { Post, PostPage } from '@/types/post';
import { apiClient } from './client';

// ===========================
// APIレスポンスをアプリケーション型に変換
// ===========================

/**
 * ApiPost を Post に変換
 */
function mapApiPostToPost(apiPost: ApiPost): Post {
  return {
    id: apiPost.id,
    title: apiPost.title,
    image: apiPost.image,
    description: apiPost.description,
    date: apiPost.date,
    tags: apiPost.tags,
  };
}

/**
 * ApiPostDetail を PostPage に変換
 */
function mapApiPostDetailToPostPage(apiPostDetail: ApiPostDetail): PostPage {
  return {
    id: apiPostDetail.id,
    title: apiPostDetail.title,
    image: apiPostDetail.image,
    description: apiPostDetail.description,
    date: apiPostDetail.date,
    tags: apiPostDetail.tags,
    peopleNum: apiPostDetail.peopleNum,
    role: apiPostDetail.role,
    period: apiPostDetail.period,
    technologys: apiPostDetail.technologys,
    content: apiPostDetail.content,
  };
}

// ===========================
// API関数
// ===========================

/**
 * プロダクション一覧を取得
 */
export async function fetchPosts(params?: GetPostsParams): Promise<Post[]> {
  // クエリパラメータの構築
  const searchParams = new URLSearchParams();
  if (params) {
    if (params.page) searchParams.append('page', String(params.page));
    if (params.limit) searchParams.append('limit', String(params.limit));
    if (params.tags && params.tags.length > 0) {
      params.tags.forEach((tag) => searchParams.append('tags', tag));
    }
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.order) searchParams.append('order', params.order);
  }

  const queryString = searchParams.toString();
  const endpoint = queryString ? `${API_ENDPOINTS.posts.list}?${queryString}` : API_ENDPOINTS.posts.list;

  const response = await apiClient.get<GetPostsResponse>(endpoint);
  return response.posts.map(mapApiPostToPost);
}

/**
 * プロダクション詳細を取得
 */
export async function fetchPostById(id: number | string): Promise<PostPage> {
  const endpoint = API_ENDPOINTS.posts.detail(id);
  const response = await apiClient.get<GetPostByIdResponse>(endpoint);
  return mapApiPostDetailToPostPage(response.post);
}

/**
 * プロダクションを検索
 */
export async function searchPosts(params: SearchPostsParams): Promise<Post[]> {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.append('q', params.q);
  if (params.page) searchParams.append('page', String(params.page));
  if (params.limit) searchParams.append('limit', String(params.limit));
  if (params.tags && params.tags.length > 0) {
    params.tags.forEach((tag) => searchParams.append('tags', tag));
  }
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params.order) searchParams.append('order', params.order);

  const queryString = searchParams.toString();
  const endpoint = queryString ? `${API_ENDPOINTS.posts.search}?${queryString}` : API_ENDPOINTS.posts.search;

  const response = await apiClient.get<GetPostsResponse>(endpoint);
  return response.posts.map(mapApiPostToPost);
}

/**
 * すべてのプロダクションを取得（ページネーションなし）
 */
export async function fetchAllPosts(): Promise<PostPage[]> {
  const endpoint = `${API_ENDPOINTS.posts.list}?limit=100`; // 大きめの limit
  const response = await apiClient.get<GetPostsResponse>(endpoint);

  // 簡易的に Post を PostPage に変換（詳細情報は各詳細APIで取得する想定）
  // または、バックエンドAPIが全詳細を返す場合はそのまま使用
  return response.posts.map((post) => ({
    ...post,
    peopleNum: 0, // デフォルト値
    role: '',
    period: '',
    technologys: [],
    content: '',
  }));
}
