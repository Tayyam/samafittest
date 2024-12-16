import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { ExportButton } from '../export/ExportButton';
import { useInBodyProgress } from '../../hooks/useInBodyProgress';
import type { InBodyData } from '../../types';

interface InBodyProgressProps {
  data: InBodyData[];
}

export const InBodyProgress = ({ data }: InBodyProgressProps) => {
  const { chartData, stats } = useInBodyProgress(data);

  const handleExport = async (format: 'pdf' | 'excel') => {
    await exportInBodyData(data, { format });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">التقدم</h3>
        <ExportButton onExport={handleExport} />
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500">الوزن</p>
          <p className="text-lg font-semibold">{stats.currentWeight} كجم</p>
          <p className={`text-sm ${stats.weightChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.weightChange > 0 ? '+' : ''}{stats.weightChange} كجم
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">العضلات</p>
          <p className="text-lg font-semibold">{stats.currentMuscle} كجم</p>
          <p className={`text-sm ${stats.muscleChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.muscleChange > 0 ? '+' : ''}{stats.muscleChange} كجم
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">الدهون</p>
          <p className="text-lg font-semibold">{stats.currentFat}%</p>
          <p className={`text-sm ${stats.fatChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.fatChange > 0 ? '+' : ''}{stats.fatChange}%
          </p>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), 'MM/dd', { locale: ar })}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(date) => format(new Date(date), 'PPP', { locale: ar })}
              formatter={(value, name) => [
                value,
                name === 'weight' ? 'الوزن' :
                name === 'muscleMass' ? 'العضلات' :
                'الدهون'
              ]}
            />
            <Line
              type="monotone"
              dataKey="weight"
              name="الوزن"
              stroke="#1A105F"
              strokeWidth={2}
              dot={{ fill: '#1A105F' }}
            />
            <Line
              type="monotone"
              dataKey="muscleMass"
              name="العضلات"
              stroke="#7CDEE6"
              strokeWidth={2}
              dot={{ fill: '#7CDEE6' }}
            />
            <Line
              type="monotone"
              dataKey="fatPercentage"
              name="الدهون"
              stroke="#FF6B6B"
              strokeWidth={2}
              dot={{ fill: '#FF6B6B' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};