import { useMemo } from 'react';
import { Dumbbell, TrendingUp, TrendingDown } from 'lucide-react';
import type { WorkoutEntry } from '../../types';

interface WorkoutSummaryProps {
  data: WorkoutEntry[];
}

export const WorkoutSummary = ({ data }: WorkoutSummaryProps) => {
  const summary = useMemo(() => {
    const totalCalories = data.reduce((sum, entry) => sum + entry.caloriesBurned, 0);
    const totalDuration = data.reduce((sum, entry) => sum + entry.duration, 0);
    
    return {
      totalCalories,
      totalDuration,
      workoutCount: data.length
    };
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">السعرات المحروقة</p>
          <p className="text-2xl font-bold">{summary.totalCalories}</p>
        </div>
        <Dumbbell className="w-8 h-8 text-sama-dark opacity-20" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">عدد التمارين</span>
          <span className="text-sm font-medium">{summary.workoutCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">الوقت الإجمالي</span>
          <span className="text-sm font-medium">{summary.totalDuration} دقيقة</span>
        </div>
      </div>
    </div>
  );
};