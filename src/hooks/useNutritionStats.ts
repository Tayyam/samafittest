import { useMemo } from 'react';
import type { NutritionEntry } from '../types';
import { calculateTotalCalories, calculateMacroTotals } from '../utils/nutrition/calculations';
import { calculateDailyGoals } from '../utils/nutrition/goals';
import { calculateProgress } from '../utils/nutrition/progress';

export const useNutritionStats = (entries: NutritionEntry[]) => {
  const totalCalories = useMemo(() => calculateTotalCalories(entries), [entries]);
  const goals = useMemo(() => calculateDailyGoals(), []);
  const progress = useMemo(() => calculateProgress(entries), [entries]);

  const macroData = useMemo(() => {
    const totals = calculateMacroTotals(entries);
    return [
      { name: 'protein', value: Math.round(totals.protein) },
      { name: 'carbs', value: Math.round(totals.carbs) },
      { name: 'fats', value: Math.round(totals.fats) }
    ];
  }, [entries]);

  return {
    totalCalories,
    goals,
    progress,
    macroData
  };
};