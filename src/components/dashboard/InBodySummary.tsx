import { useMemo } from 'react';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
import type { InBodyData } from '../../types';

interface InBodySummaryProps {
  data: InBodyData[];
}

export const InBodySummary = ({ data }: InBodySummaryProps) => {
  const summary = useMemo(() => {
    if (data.length === 0) return null;

    const latest = data[0];
    const previous = data[1];

    const changes = previous ? {
      weight: +(latest.weight - previous.weight).toFixed(1),
      muscle: +(latest.muscleMass - previous.muscleMass).toFixed(1),
      fat: +(latest.fatPercentage - previous.fatPercentage).toFixed(1),
    } : null;

    return {
      latest,
      changes
    };
  }, [data]);

  if (!summary) {
    return (
      <div className="text-center text-gray-500">
        لا توجد قياسات مسجلة
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">النتيجة</p>
          <p className="text-2xl font-bold">{summary.latest.score}</p>
        </div>
        <Activity className="w-8 h-8 text-sama-dark opacity-20" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">الوزن</span>
          <div className="flex items-center">
            <span className="text-sm font-medium">{summary.latest.weight} كجم</span>
            {summary.changes && (
              <span className={`text-xs mr-2 ${
                summary.changes.weight <= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {summary.changes.weight > 0 ? '+' : ''}{summary.changes.weight}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">العضلات</span>
          <div className="flex items-center">
            <span className="text-sm font-medium">{summary.latest.muscleMass} كجم</span>
            {summary.changes && (
              <span className={`text-xs mr-2 ${
                summary.changes.muscle >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {summary.changes.muscle > 0 ? '+' : ''}{summary.changes.muscle}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">نسبة الدهون</span>
          <div className="flex items-center">
            <span className="text-sm font-medium">{summary.latest.fatPercentage}%</span>
            {summary.changes && (
              <span className={`text-xs mr-2 ${
                summary.changes.fat <= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {summary.changes.fat > 0 ? '+' : ''}{summary.changes.fat}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};