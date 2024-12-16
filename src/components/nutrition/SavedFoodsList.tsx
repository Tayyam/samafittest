import type { SavedFood } from '../../types/nutrition';

interface SavedFoodsListProps {
  foods: SavedFood[];
  onSelect: (food: SavedFood) => void;
}

export const SavedFoodsList = ({ foods, onSelect }: SavedFoodsListProps) => {
  if (foods.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">الأطعمة المحفوظة</h3>
      <div className="flex flex-wrap gap-2">
        {foods.map((food) => (
          <button
            key={food.id}
            onClick={() => onSelect(food)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          >
            {food.name}
          </button>
        ))}
      </div>
    </div>
  );
};