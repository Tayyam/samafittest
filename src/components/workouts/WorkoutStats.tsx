import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ExportButton } from '../export/ExportButton';
import { useWorkoutStats } from '../../hooks/useWorkoutStats';
import type { WorkoutEntry } from '../../types';

interface WorkoutStatsProps {
  entries: WorkoutEntry[];
}

export const WorkoutStats = ({ entries }: WorkoutStatsProps) => {
  const { chartData, summary } = useWorkoutStats(entries);

  const handleExport = async (format: 'pdf' | 'excel') => {
    await exportWorkoutData(entries, { format });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">ملخص اليوم</h3>
        <ExportButton onExport={handleExport} />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">السعرات المحروقة</p>
          <p className="text-2xl font-bold">{summary.totalCalories}</p>
          <p className={`text-sm ${summary.caloriesChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {summary.caloriesChange > 0 ? '+' : ''}{summary.caloriesChange}% عن المعدل
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">وقت التمرين</p>
          <p className="text-2xl font-bold">{summary.totalDuration} دقيقة</p>
          <p className={`text-sm ${summary.durationChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {summary.durationChange > 0 ? '+' : ''}{summary.durationChange}% عن المعدل
          </p>
        </div>
      </div>

      {/* Workout Distribution Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickFormatter={(value) => 
                value === 'running' ? 'جري' :
                value === 'walking' ? 'مشي' :
                value === 'cycling' ? 'دراجة' :
                value === 'swimming' ? 'سباحة' :
                'تمارين قوة'
              }
            />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                name === 'calories' ? `${value} سعرة` : `${value} دقيقة`,
                name === 'calories' ? 'السعرات' : 'المدة'
              ]}
            />
            <Bar dataKey="calories" name="السعرات" fill="#1A105F" />
            <Bar dataKey="duration" name="المدة" fill="#7CDEE6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};