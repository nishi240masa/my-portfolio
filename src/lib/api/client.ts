/**
 * APIクライアント
 * バックエンドAPIとの通信を担当
 */

'use client';

import { API_CONFIG, HTTP_METHODS, type HttpMethod } from '@/config/api';
import {
  NetworkError,
  TimeoutError,
  createErrorFromStatus,
  isRetriableError,
  type ApiError,
} from './errors';

// ===========================
// 型定義
// ===========================

interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retryCount?: number;
}

// ===========================
// APIクライアントクラス
// ===========================

export class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;
  private defaultRetryCount: number;

  constructor(baseUrl?: string, timeout?: number, retryCount?: number) {
    this.baseUrl = baseUrl || API_CONFIG.baseUrl;
    this.defaultTimeout = timeout || API_CONFIG.timeout;
    this.defaultRetryCount = retryCount || API_CONFIG.retryCount;
  }

  /**
   * GETリクエスト
   */
  async get<T>(endpoint: string, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: HTTP_METHODS.GET,
    });
  }

  /**
   * POSTリクエスト
   */
  async post<T>(endpoint: string, body: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: HTTP_METHODS.POST,
      body,
    });
  }

  /**
   * PUTリクエスト
   */
  async put<T>(endpoint: string, body: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: HTTP_METHODS.PUT,
      body,
    });
  }

  /**
   * PATCHリクエスト
   */
  async patch<T>(endpoint: string, body: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: HTTP_METHODS.PATCH,
      body,
    });
  }

  /**
   * DELETEリクエスト
   */
  async delete<T>(endpoint: string, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: HTTP_METHODS.DELETE,
    });
  }

  /**
   * 汎用リクエストメソッド（リトライロジック付き）
   */
  private async request<T>(endpoint: string, options: RequestOptions): Promise<T> {
    const retryCount = options.retryCount ?? this.defaultRetryCount;
    let lastError: ApiError | Error | undefined;

    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        return await this.executeRequest<T>(endpoint, options);
      } catch (error) {
        lastError = error as ApiError | Error;

        // リトライ不可能なエラーの場合は即座にthrow
        if (!isRetriableError(error)) {
          throw error;
        }

        // 最後の試行の場合はthrow
        if (attempt === retryCount) {
          throw error;
        }

        // リトライ前の待機（指数バックオフ）
        const waitTime = Math.min(1000 * 2 ** attempt, 10000); // 最大10秒
        await this.sleep(waitTime);

        console.warn(`リトライ中... (${attempt + 1}/${retryCount})`);
      }
    }

    throw lastError;
  }

  /**
   * リクエストの実行
   */
  private async executeRequest<T>(endpoint: string, options: RequestOptions): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const timeout = options.timeout ?? this.defaultTimeout;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      const response = await fetch(url, {
        method: options.method || HTTP_METHODS.GET,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // ステータスコードのチェック
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw createErrorFromStatus(response.status, errorData.message, errorData.details);
      }

      // レスポンスのパース
      const data = await response.json();
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      // AbortErrorの場合はタイムアウト
      if (error instanceof Error && error.name === 'AbortError') {
        throw new TimeoutError();
      }

      // ネットワークエラー
      if (error instanceof TypeError) {
        throw new NetworkError();
      }

      // その他のエラーはそのままthrow
      throw error;
    }
  }

  /**
   * スリープ関数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}

// ===========================
// シングルトンインスタンス
// ===========================

export const apiClient = new ApiClient();
