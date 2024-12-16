import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { WorkoutEntry } from '../../types';

interface WorkoutTableProps {
  entries: WorkoutEntry[];
  loading?: boolean;
}

export const WorkoutTable = ({ entries, loading }: WorkoutTableProps) => {
  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        لم يتم إضافة أي تمارين بعد
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الوقت
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              التمرين
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              المدة (دقيقة)
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              السعرات المحروقة
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(entry.date, 'p', { locale: ar })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {entry.exercise}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {entry.duration}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {entry.caloriesBurned}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};