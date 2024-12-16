import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ExportButton } from '../export/ExportButton';
import { useNutritionStats } from '../../hooks/useNutritionStats';
import type { NutritionEntry } from '../../types';

interface NutritionStatsProps {
  entries: NutritionEntry[];
}

export const NutritionStats = ({ entries }: NutritionStatsProps) => {
  const { macroData, totalCalories, goals, progress } = useNutritionStats(entries);

  const COLORS = ['#1A105F', '#7CDEE6', '#FF6B6B'];

  const handleExport = async (format: 'pdf' | 'excel') => {
    await exportNutritionData(entries, { format });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">ملخص اليوم</h3>
        <ExportButton onExport={handleExport} />
      </div>

      {/* Calories Summary */}
      <div>
        <div className="flex justify-between items-baseline">
          <p className="text-sm text-gray-500">السعرات الحرارية</p>
          <p className="text-xs text-gray-400">الهدف: {goals.calories}</p>
        </div>
        <p className="text-2xl font-bold">{totalCalories}</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-sama-dark rounded-full h-2"
            style={{ width: `${Math.min(100, (totalCalories / goals.calories) * 100)}%` }}
          />
        </div>
      </div>

      {/* Macros Distribution */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={macroData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {macroData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${value}g`,
                name === 'protein' ? 'البروتين' :
                name === 'carbs' ? 'الكربوهيدرات' :
                'الدهون'
              ]}
            />
            <Legend
              formatter={(value) => 
                value === 'protein' ? 'البروتين' :
                value === 'carbs' ? 'الكربوهيدرات' :
                'الدهون'
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4">
        {Object.entries(progress).map(([macro, { current, goal }]) => (
          <div key={macro}>
            <div className="flex justify-between items-baseline">
              <p className="text-sm text-gray-500">
                {macro === 'protein' ? 'البروتين' :
                 macro === 'carbs' ? 'الكربوهيدرات' :
                 'الدهون'}
              </p>
              <p className="text-xs text-gray-400">{current}g / {goal}g</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className={`rounded-full h-2 ${
                  macro === 'protein' ? 'bg-sama-dark' :
                  macro === 'carbs' ? 'bg-sama-light' :
                  'bg-red-400'
                }`}
                style={{ width: `${Math.min(100, (current / goal) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};