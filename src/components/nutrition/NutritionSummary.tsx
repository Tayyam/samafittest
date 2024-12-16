import { useMemo } from 'react';
import { Utensils } from 'lucide-react';
import type { NutritionEntry } from '../../types';

interface NutritionSummaryProps {
  data: NutritionEntry[];
}

export const NutritionSummary = ({ data }: NutritionSummaryProps) => {
  const summary = useMemo(() => {
    const totalCalories = data.reduce((sum, entry) => sum + entry.calories, 0);
    const totalProtein = data.reduce((sum, entry) => sum + entry.protein, 0);
    const totalCarbs = data.reduce((sum, entry) => sum + entry.carbs, 0);
    const totalFats = data.reduce((sum, entry) => sum + entry.fats, 0);

    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats,
      mealCount: data.length
    };
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">السعرات المستهلكة</p>
          <p className="text-2xl font-bold">{summary.totalCalories}</p>
        </div>
        <Utensils className="w-8 h-8 text-sama-dark opacity-20" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">عدد الوجبات</span>
          <span className="text-sm font-medium">{summary.mealCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">البروتين</span>
          <span className="text-sm font-medium">{summary.totalProtein}g</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">الكربوهيدرات</span>
          <span className="text-sm font-medium">{summary.totalCarbs}g</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">الدهون</span>
          <span className="text-sm font-medium">{summary.totalFats}g</span>
        </div>
      </div>
    </div>
  );
};