import { useState } from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { NutritionInput } from '../../components/nutrition/NutritionInput';
import { NutritionTable } from '../../components/nutrition/NutritionTable';
import { NutritionStats } from '../../components/nutrition/NutritionStats';
import { CopyMealsDialog } from '../../components/nutrition/CopyMealsDialog';
import { PreviousMealsDialog } from '../../components/nutrition/PreviousMealsDialog';
import { addNutritionEntry } from '../../lib/firebase/nutrition';
import { useNutrition } from '../../hooks/useNutrition';
import { Button } from '../../components/ui/Button';
import { analyzeNutrition } from '../../lib/openai/nutrition';

export const NutritionPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [isPreviousMealsOpen, setIsPreviousMealsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    entries,
    addEntry,
    deleteEntry,
    deleteAllEntries,
    loading,
    analysisLoading
  } = useNutrition(selectedDate);

  const handleNutritionSubmit = async (text: string) => {
    try {
      setIsSubmitting(true);
      const analyses = await analyzeNutrition(text);
      
      // إضافة كل طعام كإدخال منفصل
      for (const analysis of analyses) {
        const result = await addNutritionEntry(analysis);
        if (result) {
          await addEntry(result);
        }
      }
    } catch (error) {
      console.error('Error submitting nutrition:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">التغذية</h1>
          <div className="flex space-x-2 space-x-reverse">
            <Button onClick={() => setIsCopyDialogOpen(true)}>
              نسخ وجبات يوم آخر
            </Button>
            <Button onClick={() => setIsPreviousMealsOpen(true)}>
              الوجبات السابقة
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <NutritionInput 
              onSubmit={handleNutritionSubmit}
              isLoading={isSubmitting || analysisLoading}
            />
            
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

        <CopyMealsDialog
          isOpen={isCopyDialogOpen}
          onClose={() => setIsCopyDialogOpen(false)}
          onCopy={addEntry}
          currentDate={selectedDate}
        />

        <PreviousMealsDialog
          isOpen={isPreviousMealsOpen}
          onClose={() => setIsPreviousMealsOpen(false)}
          onSelect={addEntry}
        />
      </div>
    </DashboardLayout>
  );
};