// Default macro ratios (40/40/20)
const DEFAULT_PROTEIN_RATIO = 0.4;
const DEFAULT_CARBS_RATIO = 0.4;
const DEFAULT_FATS_RATIO = 0.2;

// Calories per gram of each macro
const PROTEIN_CALORIES_PER_GRAM = 4;
const CARBS_CALORIES_PER_GRAM = 4;
const FATS_CALORIES_PER_GRAM = 9;

export const calculateDailyGoals = (targetCalories: number = 2000) => {
  const proteinTarget = Math.round((targetCalories * DEFAULT_PROTEIN_RATIO) / PROTEIN_CALORIES_PER_GRAM);
  const carbsTarget = Math.round((targetCalories * DEFAULT_CARBS_RATIO) / CARBS_CALORIES_PER_GRAM);
  const fatsTarget = Math.round((targetCalories * DEFAULT_FATS_RATIO) / FATS_CALORIES_PER_GRAM);

  return {
    calories: targetCalories,
    protein: proteinTarget,
    carbs: carbsTarget,
    fats: fatsTarget
  };
};