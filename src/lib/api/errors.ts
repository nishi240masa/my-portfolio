/**
 * API エラー処理
 */

import { API_ERROR_CODES, ApiErrorCode } from '@/config/api';

// ===========================
// カスタムエラークラス
// ===========================

/**
 * API エラーの基底クラス
 */
export class ApiError extends Error {
  code: ApiErrorCode;
  statusCode?: number;
  details?: unknown;

  constructor(message: string, code: ApiErrorCode, statusCode?: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // プロトタイプチェーンの修正（TypeScriptのバグ対策）
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * ネットワークエラー
 */
export class NetworkError extends ApiError {
  constructor(message = 'ネットワークエラーが発生しました') {
    super(message, API_ERROR_CODES.NETWORK_ERROR);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * タイムアウトエラー
 */
export class TimeoutError extends ApiError {
  constructor(message = 'リクエストがタイムアウトしました') {
    super(message, API_ERROR_CODES.TIMEOUT);
    this.name = 'TimeoutError';
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

/**
 * 404 Not Found エラー
 */
export class NotFoundError extends ApiError {
  constructor(message = 'リソースが見つかりませんでした') {
    super(message, API_ERROR_CODES.NOT_FOUND, 404);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * 401 Unauthorized エラー
 */
export class UnauthorizedError extends ApiError {
  constructor(message = '認証が必要です') {
    super(message, API_ERROR_CODES.UNAUTHORIZED, 401);
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * 403 Forbidden エラー
 */
export class ForbiddenError extends ApiError {
  constructor(message = 'アクセスが拒否されました') {
    super(message, API_ERROR_CODES.FORBIDDEN, 403);
    this.name = 'ForbiddenError';
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * 400 Bad Request エラー
 */
export class BadRequestError extends ApiError {
  constructor(message = '不正なリクエストです', details?: unknown) {
    super(message, API_ERROR_CODES.BAD_REQUEST, 400, details);
    this.name = 'BadRequestError';
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends ApiError {
  constructor(message = 'サーバーエラーが発生しました') {
    super(message, API_ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
    this.name = 'InternalServerError';
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

// ===========================
// エラーハンドリング関数
// ===========================

/**
 * HTTPステータスコードに基づいてエラーを生成
 */
export function createErrorFromStatus(status: number, message?: string, details?: unknown): ApiError {
  switch (status) {
    case 400:
      return new BadRequestError(message, details);
    case 401:
      return new UnauthorizedError(message);
    case 403:
      return new ForbiddenError(message);
    case 404:
      return new NotFoundError(message);
    case 500:
    case 502:
    case 503:
    case 504:
      return new InternalServerError(message);
    default:
      return new ApiError(message || 'エラーが発生しました', API_ERROR_CODES.UNKNOWN, status, details);
  }
}

/**
 * エラーがリトライ可能かどうかを判定
 */
export function isRetriableError(error: unknown): boolean {
  if (error instanceof NetworkError || error instanceof TimeoutError) {
    return true;
  }

  if (error instanceof ApiError) {
    // 5xx系エラーはリトライ可能
    return error.statusCode !== undefined && error.statusCode >= 500 && error.statusCode < 600;
  }

  return false;
}

/**
 * エラーメッセージをユーザーフレンドリーな形式に変換
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'エラーが発生しました';
}
