import { useMemo } from 'react';
import type { NutritionEntry } from '../../types';

interface NutritionStatsProps {
  entries: NutritionEntry[];
}

export const NutritionStats = ({ entries }: NutritionStatsProps) => {
  const stats = useMemo(() => {
    return entries.reduce((acc, entry) => {
      return {
        calories: (acc.calories || 0) + (Number(entry.calories) || 0),
        protein: (acc.protein || 0) + (Number(entry.protein) || 0),
        carbs: (acc.carbs || 0) + (Number(entry.carbs) || 0),
        fats: (acc.fats || 0) + (Number(entry.fats) || 0)
      };
    }, {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0
    });
  }, [entries]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">ملخص اليوم</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">السعرات الحرارية</span>
          <span className="font-medium">{stats.calories.toFixed(0)} سعرة</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">البروتين</span>
          <span className="font-medium">{stats.protein.toFixed(1)} جرام</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">الكربوهيدرات</span>
          <span className="font-medium">{stats.carbs.toFixed(1)} جرام</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">الدهون</span>
          <span className="font-medium">{stats.fats.toFixed(1)} جرام</span>
        </div>
      </div>
    </div>
  );
};