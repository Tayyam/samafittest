import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { NutritionInput } from '../../components/nutrition/NutritionInput';
import { NutritionTable } from '../../components/nutrition/NutritionTable';
import { NutritionStats } from '../../components/nutrition/NutritionStats';
import { useNutrition } from '../../hooks/useNutrition';
import { useNutritionAnalysis } from '../../hooks/useNutritionAnalysis';
import { analyzeNutritionText } from '../../lib/ai/nutritionAnalyzer';

export const NutritionPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { entries, addEntry, deleteEntry, deleteAllEntries, loading } = useNutrition(selectedDate);
  const { loading: analysisLoading, handleAnalysis } = useNutritionAnalysis();

  const handleNutritionSubmit = async (text: string) => {
    try {
      const meals = await analyzeNutritionText(text);
      
      // إضافة كل الوجبات المحللة إلى الجدول مباشرة
      for (const meal of meals) {
        for (const food of meal.foods) {
          const analysis = await handleAnalysis({
            food: food.food,
            quantity: food.quantity,
            unit: food.unit
          });

          await addEntry({
            food: food.food,
            quantity: food.quantity || '1',
            unit: food.unit || '',
            calories: Math.round(analysis.calories),
            protein: Math.round(analysis.protein),
            carbs: Math.round(analysis.carbs),
            fats: Math.round(analysis.fats),
            date: new Date()
          });
        }
      }
    } catch (error) {
      console.error('Error handling nutrition analysis:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">تتبع التغذية</h1>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">إضافة وجبة جديدة</h2>
              <NutritionInput 
                onSubmit={handleNutritionSubmit}
                isLoading={analysisLoading || loading}
              />
            </div>
            
            <NutritionTable 
              entries={entries} 
              loading={loading}
              onDeleteEntry={deleteEntry}
              onDeleteAll={deleteAllEntries}
            />
          </div>
          
          <div>
            <NutritionStats entries={entries} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};