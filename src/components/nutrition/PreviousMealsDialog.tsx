import { useState, useEffect } from 'react';
import { Dialog } from '../ui/Dialog';
import { getUserPreviousMeals } from '../../lib/firebase/nutrition';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { NutritionEntry } from '../../types';

interface PreviousMealsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (meal: NutritionEntry) => void;
}

export const PreviousMealsDialog = ({
  isOpen,
  onClose,
  onSelect
}: PreviousMealsDialogProps) => {
  const [meals, setMeals] = useState<NutritionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadPreviousMeals();
    }
  }, [isOpen]);

  const loadPreviousMeals = async () => {
    try {
      setLoading(true);
      const previousMeals = await getUserPreviousMeals();
      
      // تجميع الوجبات المتكررة وإزالة التكرار مع الاحتفاظ بأحدث تاريخ
      const uniqueMeals = previousMeals.reduce((acc, meal) => {
        const key = `${meal.food}-${meal.amount}-${meal.unit}`;
        const mealDate = meal.date instanceof Date 
          ? meal.date 
          : typeof meal.date === 'string' 
            ? parseISO(meal.date)
            : new Date(meal.date.seconds * 1000); // للتعامل مع Timestamp من Firestore

        if (!acc[key] || mealDate > new Date(acc[key].date)) {
          acc[key] = {
            ...meal,
            date: mealDate
          };
        }
        return acc;
      }, {} as Record<string, NutritionEntry>);
      
      setMeals(Object.values(uniqueMeals).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    } catch (error) {
      console.error('Error loading previous meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMeals = meals.filter(meal => 
    meal.food.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = async (meal: NutritionEntry) => {
    try {
      const { id, ...mealData } = meal;
      const newMeal = {
        ...mealData,
        date: new Date()
      };
      
      await onSelect(newMeal);
      onClose();
    } catch (error) {
      console.error('Error selecting meal:', error);
    }
  };

  const formatDate = (date: Date | string | { seconds: number, nanoseconds: number }) => {
    try {
      if (date instanceof Date) {
        return format(date, 'dd/MM/yyyy', { locale: ar });
      } else if (typeof date === 'string') {
        return format(parseISO(date), 'dd/MM/yyyy', { locale: ar });
      } else if (date && 'seconds' in date) {
        return format(new Date(date.seconds * 1000), 'dd/MM/yyyy', { locale: ar });
      }
      return 'تاريخ غير صالح';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'تاريخ غير صالح';
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="الوجبات السابقة"
    >
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="ابحث عن وجبة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
          />
        </div>

        {loading ? (
          <div className="text-center py-4">جاري التحميل...</div>
        ) : filteredMeals.length > 0 ? (
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredMeals.map((meal) => (
              <button
                key={`${meal.food}-${meal.amount}-${meal.unit}`}
                onClick={() => handleSelect(meal)}
                className="w-full text-right flex flex-col p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="font-medium">{meal.food}</div>
                <div className="text-sm text-gray-500">
                  {meal.amount} {meal.unit}
                </div>
                <div className="text-sm text-gray-500">
                  {meal.calories} سعرة | بروتين: {meal.protein}g | كارب: {meal.carbs}g | دهون: {meal.fats}g
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatDate(meal.date)}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            {searchTerm ? 'لا توجد نتائج' : 'لا توجد وجبات سابقة'}
          </p>
        )}
      </div>
    </Dialog>
  );
}; 