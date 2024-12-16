import type { APIError } from 'openai';

export enum OpenAIErrorType {
  RateLimit = 'RATE_LIMIT',
  Auth = 'AUTH',
  Timeout = 'TIMEOUT',
  Network = 'NETWORK',
  Quota = 'QUOTA',
  Unknown = 'UNKNOWN'
}

export interface OpenAIErrorResponse {
  type: OpenAIErrorType;
  message: string;
  shouldRetry: boolean;
  shouldFallbackToManual: boolean;
}

export const handleOpenAIError = (error: unknown): OpenAIErrorResponse => {
  // Rate limit errors
  if ((error as APIError).status === 429) {
    return {
      type: OpenAIErrorType.RateLimit,
      message: 'تم تجاوز الحد المسموح به للتحليل. سيتم استخدام الإدخال اليدوي.',
      shouldRetry: false,
      shouldFallbackToManual: true
    };
  }

  // Authentication errors
  if ((error as APIError).status === 401) {
    return {
      type: OpenAIErrorType.Auth,
      message: 'خطأ في التحقق من الصلاحية. سيتم استخدام الإدخال اليدوي.',
      shouldRetry: false,
      shouldFallbackToManual: true
    };
  }

  // Timeout errors
  if ((error as Error).name === 'TimeoutError') {
    return {
      type: OpenAIErrorType.Timeout,
      message: 'انتهت مهلة الاتصال. يمكنك المحاولة مرة أخرى أو استخدام الإدخال اليدوي.',
      shouldRetry: true,
      shouldFallbackToManual: true
    };
  }

  // Network errors
  if ((error as Error).name === 'NetworkError') {
    return {
      type: OpenAIErrorType.Network,
      message: 'خطأ في الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت.',
      shouldRetry: true,
      shouldFallbackToManual: false
    };
  }

  // Quota exceeded
  if ((error as APIError).code === 'insufficient_quota') {
    return {
      type: OpenAIErrorType.Quota,
      message: 'تم تجاوز الحد المسموح به للاستخدام. سيتم استخدام الإدخال اليدوي.',
      shouldRetry: false,
      shouldFallbackToManual: true
    };
  }

  // Log unexpected errors
  console.error('Unexpected OpenAI API Error:', error);
  
  return {
    type: OpenAIErrorType.Unknown,
    message: 'حدث خطأ غير متوقع. يمكنك المحاولة مرة أخرى أو استخدام الإدخال اليدوي.',
    shouldRetry: true,
    shouldFallbackToManual: true
  };
};