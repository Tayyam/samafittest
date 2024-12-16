interface NutritionEntryProps {
  entry: NutritionEntry;
  onDelete?: (id: string) => void;
}

export const NutritionEntry = ({ entry, onDelete }: NutritionEntryProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{entry.food}</span>
          <span className="text-gray-600">
            ({entry.amount} {entry.unit})
          </span>
        </div>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>{entry.calories} سعرة</span>
          <span>{entry.protein}g بروتين</span>
          <span>{entry.carbs}g كارب</span>
          <span>{entry.fats}g دهون</span>
        </div>
      </div>
      
      {onDelete && (
        <button
          onClick={() => onDelete(entry.id)}
          className="p-1 text-red-500 hover:text-red-700"
          aria-label="حذف"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
}; 