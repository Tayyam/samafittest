import { useState, useEffect } from 'react';
import { Dialog } from '../ui/Dialog';
import { getNutritionEntriesByDate } from '../../lib/firebase/nutrition';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { NutritionEntry } from '../../types';
import { Button } from '../ui/Button';

interface CopyMealsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCopy: (entries: NutritionEntry[]) => void;
  currentDate: Date;
}

export const CopyMealsDialog = ({
  isOpen,
  onClose,
  onCopy,
  currentDate
}: CopyMealsDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<NutritionEntry[]>([]);

  useEffect(() => {
    if (isOpen && selectedDate) {
      loadMeals();
    }
  }, [isOpen, selectedDate]);

  const loadMeals = async () => {
    setLoading(true);
    try {
      const meals = await getNutritionEntriesByDate(selectedDate);
      setEntries(meals);
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(new Date(date));
  };

  const handleCopy = async () => {
    try {
      const copiedEntries = entries.map(entry => {
        const { id, ...entryData } = entry;
        return {
          ...entryData,
          date: currentDate
        };
      });
      
      await onCopy(copiedEntries);
      onClose();
    } catch (error) {
      console.error('Error copying meals:', error);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="نسخ وجبات من يوم آخر"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            اختر اليوم
          </label>
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => handleDateChange(e.target.value)}
            max={format(new Date(), 'yyyy-MM-dd')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
          />
        </div>

        {loading ? (
          <div className="text-center py-4">جاري التحميل...</div>
        ) : entries.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">الوجبات المتوفرة:</p>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <span>{entry.food}</span>
                  <span className="text-sm text-gray-500">
                    {entry.calories} سعرة
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">لا توجد وجبات في هذا اليوم</p>
        )}

        <div className="flex justify-end space-x-2 space-x-reverse mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            onClick={handleCopy}
            disabled={entries.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-sama-dark rounded-md hover:bg-sama-light disabled:opacity-50"
          >
            نسخ الوجبات
          </button>
        </div>
      </div>
    </Dialog>
  );
}; 