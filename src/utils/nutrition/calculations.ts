import type { NutritionEntry } from '../../types';

export const calculateTotalCalories = (entries: NutritionEntry[]): number => {
  return entries.reduce((sum, entry) => sum + entry.calories, 0);
};

export const calculateMacroTotals = (entries: NutritionEntry[]) => {
  return entries.reduce(
    (acc, entry) => ({
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fats: acc.fats + entry.fats,
    }),
    { protein: 0, carbs: 0, fats: 0 }
  );
};

export const calculateMacroPercentages = (
  protein: number,
  carbs: number,
  fats: number
) => {
  const total = protein + carbs + fats;
  if (total === 0) return { protein: 0, carbs: 0, fats: 0 };

  return {
    protein: Math.round((protein / total) * 100),
    carbs: Math.round((carbs / total) * 100),
    fats: Math.round((fats / total) * 100),
  };
};