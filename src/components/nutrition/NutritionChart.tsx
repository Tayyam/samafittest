import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { NutritionEntry } from '../../types';

interface NutritionChartProps {
  entries: NutritionEntry[];
}

export const NutritionChart = ({ entries }: NutritionChartProps) => {
  const chartData = useMemo(() => {
    const mealsMap = new Map<string, number>();
    
    entries.forEach(entry => {
      const hour = new Date(entry.date).getHours();
      let mealType = '';
      
      // تحديد نوع الوجبة حسب الوقت
      if (hour >= 5 && hour < 11) mealType = 'فطور';
      else if (hour >= 11 && hour < 16) mealType = 'غداء';
      else if (hour >= 16 && hour < 19) mealType = 'عصر';
      else if (hour >= 19 && hour < 24) mealType = 'عشاء';
      else mealType = 'وجبة خفيفة';

      const currentCalories = mealsMap.get(mealType) || 0;
      mealsMap.set(mealType, currentCalories + entry.calories);
    });

    return Array.from(mealsMap.entries()).map(([name, calories]) => ({
      name,
      calories: Math.round(calories)
    }));
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        لا توجد بيانات لعرضها
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        توزيع السعرات الحرارية
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis 
              dataKey="name"
              stroke="#4B5563"
              fontSize={12}
            />
            <YAxis
              stroke="#4B5563"
              fontSize={12}
              tickFormatter={(value) => `${value} سعرة`}
            />
            <Tooltip
              formatter={(value) => [`${value} سعرة`, 'السعرات الحرارية']}
              labelStyle={{ fontFamily: 'inherit' }}
            />
            <Bar
              dataKey="calories"
              fill="#1A105F"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 