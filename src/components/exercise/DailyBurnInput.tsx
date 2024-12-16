import { useState, useEffect } from 'react';
import { updateDailyBurn, getDailyBurn } from '../../lib/firebase/exercise';
import { useAuth } from '../../hooks/useAuth';

export const DailyBurnInput = () => {
  const { user } = useAuth();
  const [bmr, setBmr] = useState<number>(0);
  const [activityCalories, setActivityCalories] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadDailyBurn = async () => {
      if (user?.id) {
        try {
          const data = await getDailyBurn(user.id);
          setBmr(data.bmr || 0);
          setActivityCalories(data.activityCalories || 0);
        } catch (error) {
          console.error('Error loading daily burn:', error);
        }
      }
    };

    loadDailyBurn();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsLoading(true);
    try {
      await updateDailyBurn(user.id, { bmr, activityCalories });
    } catch (error) {
      console.error('Error updating daily burn:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h3 className="text-lg font-semibold mb-4">معدل الحرق اليومي</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            معدل الحرق الأساسي (BMR)
          </label>
          <input
            type="number"
            value={bmr}
            onChange={(e) => setBmr(Number(e.target.value))}
            className="w-full p-2 border rounded-md"
            min="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            سعرات الحركة
          </label>
          <input
            type="number"
            value={activityCalories}
            onChange={(e) => setActivityCalories(Number(e.target.value))}
            className="w-full p-2 border rounded-md"
            min="0"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'جاري الحفظ...' : 'حفظ'}
        </button>
      </form>

      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-600">
          إجمالي الحرق اليومي: {bmr + activityCalories} سعرة
        </p>
      </div>
    </div>
  );
}; 