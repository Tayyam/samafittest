import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { NutritionEntry } from '../../types';
import { TrashIcon } from '@heroicons/react/24/outline';

interface NutritionTableProps {
  entries: NutritionEntry[];
  loading?: boolean;
  onDeleteEntry?: (id: string) => Promise<void>;
  onDeleteAll?: () => Promise<void>;
}

export const NutritionTable = ({ 
  entries, 
  loading,
  onDeleteEntry,
  onDeleteAll 
}: NutritionTableProps) => {
  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        لم يتم إضافة أي وجبات بعد
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">سجل الوجبات</h3>
        {entries.length > 0 && onDeleteAll && (
          <button
            onClick={onDeleteAll}
            className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
          >
            <TrashIcon className="w-4 h-4" />
            حذف الكل
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الوقت
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الطعام
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الكمية
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                السعرات
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                البروتين
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الكربوهيدرات
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الدهون
              </th>
              {onDeleteEntry && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  إجراءات
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(entry.date, 'p', { locale: ar })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {entry.food}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.quantity} {entry.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.calories}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.protein}g
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.carbs}g
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.fats}g
                </td>
                {onDeleteEntry && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};