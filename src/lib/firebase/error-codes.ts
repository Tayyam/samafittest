export enum FirebaseErrorCode {
  FAILED_PRECONDITION = 'failed-precondition',
  PERMISSION_DENIED = 'permission-denied',
  UNAUTHENTICATED = 'unauthenticated',
  NOT_FOUND = 'not-found',
  NETWORK_ERROR = 'network-error',
  UNKNOWN = 'unknown'
}

export const getErrorMessage = (code: FirebaseErrorCode): string => {
  switch (code) {
    case FirebaseErrorCode.FAILED_PRECONDITION:
      return 'عذراً، يجب فتح التطبيق في نافذة واحدة فقط';
    case FirebaseErrorCode.PERMISSION_DENIED:
      return 'عذراً، ليس لديك صلاحية للوصول إلى هذه البيانات';
    case FirebaseErrorCode.UNAUTHENTICATED:
      return 'يرجى تسجيل الدخول للمتابعة';
    case FirebaseErrorCode.NOT_FOUND:
      return 'لم يتم العثور على البيانات المطلوبة';
    case FirebaseErrorCode.NETWORK_ERROR:
      return 'حدث خطأ في الاتصال بالشبكة';
    default:
      return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى';
  }
};