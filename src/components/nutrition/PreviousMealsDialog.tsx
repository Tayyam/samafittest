import { useState, useEffect } from 'react';
import { Dialog } from '../ui/Dialog';
import { getUserPreviousMeals } from '../../lib/firebase/nutrition';
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
      // تجميع الوجبات المتكررة وإزالة التكرار
      const uniqueMeals = previousMeals.reduce((acc, meal) => {
        const key = `${meal.food}-${meal.calories}`;
        if (!acc[key]) {
          acc[key] = meal;
        }
        return acc;
      }, {} as Record<string, NutritionEntry>);
      
      setMeals(Object.values(uniqueMeals));
    } catch (error) {
      console.error('Error loading previous meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMeals = meals.filter(meal => 
    meal.food.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (meal: NutritionEntry) => {
    onSelect({
      ...meal,
      date: new Date(),
      id: Date.now().toString()
    });
    onClose();
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
                key={`${meal.food}-${meal.calories}`}
                onClick={() => handleSelect(meal)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div>
                  <div className="font-medium">{meal.food}</div>
                  <div className="text-sm text-gray-500">
                    {meal.calories} سعرة | بروتين: {meal.protein}g | كارب: {meal.carbs}g | دهون: {meal.fats}g
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            {searchTerm ? 'لا توجد نتائج' : 'لا توجد وجبات سابقة'}
          </p>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            إغلاق
          </button>
        </div>
      </div>
    </Dialog>
  );
}; 