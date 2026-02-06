/**
 * API設定
 */

// ===========================
// 環境変数の取得
// ===========================

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
  timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10000,
  retryCount: Number(process.env.NEXT_PUBLIC_API_RETRY_COUNT) || 3,
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true',
} as const;

// ===========================
// APIエンドポイント定義
// ===========================

export const API_ENDPOINTS = {
  // プロダクション関連
  posts: {
    list: '/posts',
    detail: (id: number | string) => `/posts/${id}`,
    search: '/posts/search',
  },
  // 将来的に追加される可能性があるエンドポイント
  profile: {
    get: '/profile',
  },
  skills: {
    list: '/skills',
  },
} as const;

// ===========================
// HTTPメソッド
// ===========================

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export type HttpMethod = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];

// ===========================
// HTTPステータスコード
// ===========================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ===========================
// エラーコード
// ===========================

export const API_ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  BAD_REQUEST: 'BAD_REQUEST',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  UNKNOWN: 'UNKNOWN',
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];
