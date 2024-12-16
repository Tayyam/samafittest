import { XCircle } from 'lucide-react';

interface NutritionErrorProps {
  message: string;
  onRetry?: () => void;
}

export const NutritionError = ({ message, onRetry }: NutritionErrorProps) => {
  return (
    <div className="bg-red-50 p-4 rounded-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="mr-3">
          <h3 className="text-sm font-medium text-red-800">حدث خطأ</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 text-sm font-medium text-red-600 hover:text-red-500"
            >
              إعادة المحاولة
            </button>
          )}
        </div>
      </div>
    </div>
  );
};