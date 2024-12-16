import { FirebaseError } from 'firebase/app';
import { FirebaseErrorCode, getErrorMessage } from './error-codes';

export interface FirebaseErrorResponse {
  code: FirebaseErrorCode;
  message: string;
  shouldRetry: boolean;
  shouldReauthenticate: boolean;
}

export const handleFirebaseError = (error: unknown): FirebaseErrorResponse => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'failed-precondition':
        return {
          code: FirebaseErrorCode.FAILED_PRECONDITION,
          message: getErrorMessage(FirebaseErrorCode.FAILED_PRECONDITION),
          shouldRetry: false,
          shouldReauthenticate: false
        };
      case 'permission-denied':
        return {
          code: FirebaseErrorCode.PERMISSION_DENIED,
          message: getErrorMessage(FirebaseErrorCode.PERMISSION_DENIED),
          shouldRetry: false,
          shouldReauthenticate: true
        };
      case 'unauthenticated':
        return {
          code: FirebaseErrorCode.UNAUTHENTICATED,
          message: getErrorMessage(FirebaseErrorCode.UNAUTHENTICATED),
          shouldRetry: false,
          shouldReauthenticate: true
        };
      default:
        console.error('Unhandled Firebase error:', error);
        return {
          code: FirebaseErrorCode.UNKNOWN,
          message: getErrorMessage(FirebaseErrorCode.UNKNOWN),
          shouldRetry: true,
          shouldReauthenticate: false
        };
    }
  }

  if (error instanceof Error && error.name === 'NetworkError') {
    return {
      code: FirebaseErrorCode.NETWORK_ERROR,
      message: getErrorMessage(FirebaseErrorCode.NETWORK_ERROR),
      shouldRetry: true,
      shouldReauthenticate: false
    };
  }

  console.error('Unknown error:', error);
  return {
    code: FirebaseErrorCode.UNKNOWN,
    message: getErrorMessage(FirebaseErrorCode.UNKNOWN),
    shouldRetry: true,
    shouldReauthenticate: false
  };
};