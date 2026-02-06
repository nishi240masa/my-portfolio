/**
 * バックエンドAPIのレスポンス型定義
 */

// ===========================
// API レスポンスの基本型
// ===========================

/**
 * 成功レスポンスの基本型
 */
export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

/**
 * エラーレスポンスの型
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// ===========================
// プロダクション関連の型
// ===========================

/**
 * プロダクション一覧のレスポンス
 */
export interface GetPostsResponse {
  posts: ApiPost[];
  total: number;
  page?: number;
  limit?: number;
}

/**
 * プロダクション詳細のレスポンス
 */
export interface GetPostByIdResponse {
  post: ApiPostDetail;
}

/**
 * API から返されるプロダクション（一覧用）
 */
export interface ApiPost {
  id: number;
  title: string;
  image: string;
  description: string;
  date: string; // ISO 8601 format
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * API から返されるプロダクション詳細
 */
export interface ApiPostDetail extends ApiPost {
  peopleNum: number;
  role: string;
  period: string;
  technologys: string[];
  content: string; // Markdown形式
}

// ===========================
// リクエストパラメータの型
// ===========================

/**
 * プロダクション一覧取得のクエリパラメータ
 */
export interface GetPostsParams {
  page?: number;
  limit?: number;
  tags?: string[];
  sortBy?: 'date' | 'title';
  order?: 'asc' | 'desc';
}

/**
 * プロダクション検索のクエリパラメータ
 */
export interface SearchPostsParams extends GetPostsParams {
  q?: string; // 検索キーワード
}
