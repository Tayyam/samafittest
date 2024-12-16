import type { NutritionEntry } from '../../types';
import { calculateDailyGoals } from './goals';
import { calculateMacroTotals } from './calculations';

export const calculateProgress = (entries: NutritionEntry[]) => {
  const goals = calculateDailyGoals();
  const totals = calculateMacroTotals(entries);

  return {
    protein: {
      current: Math.round(totals.protein),
      goal: goals.protein
    },
    carbs: {
      current: Math.round(totals.carbs),
      goal: goals.carbs
    },
    fats: {
      current: Math.round(totals.fats),
      goal: goals.fats
    }
  };
};