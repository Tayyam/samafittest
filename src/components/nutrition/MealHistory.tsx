import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getNutritionHistory, copyMealsFromDate } from '../../lib/firebase/nutrition';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { NutritionEntry } from '../../types';

interface MealHistoryProps {
  onMealsCopied: () => void;
  currentDate: Date;
}

export const MealHistory = ({ onMealsCopied, currentDate }: MealHistoryProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ date: Date; meals: NutritionEntry[] }[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const loadHistory = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const historyData = await getNutritionHistory(user.id);
      // ترتيب التاريخ تنازلياً وإزالة اليوم الحالي
      const filteredHistory = historyData
        .filter(entry => format(entry.date, 'yyyy-MM-dd') !== format(currentDate, 'yyyy-MM-dd'))
        .sort((a, b) => b.date.getTime() - a.date.getTime());
      
      setHistory(filteredHistory);
    } catch (error) {
      console.error('Error loading meal history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMeals = async (sourceDate: Date) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      await copyMealsFromDate(user.id, sourceDate, currentDate);
      onMealsCopied();
      setIsOpen(false);
    } catch (error) {
      console.error('Error copying meals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) loadHistory();
        }}
        className="text-sm text-blue-600 hover:text-blue-700"
      >
        نسخ من يوم سابق
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">الوجبات السابقة</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="text-center py-4">جاري التحميل...</div>
              ) : history.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  لا توجد وجبات سابقة
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((entry) => (
                    <div
                      key={entry.date.toISOString()}
                      className="p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">
                            {format(entry.date, 'EEEE', { locale: ar })}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format(entry.date, 'd MMMM yyyy', { locale: ar })}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {entry.meals.length} وجبات
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopyMeals(entry.date)}
                          disabled={loading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          نسخ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 