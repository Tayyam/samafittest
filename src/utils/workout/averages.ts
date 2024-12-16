import type { WorkoutEntry } from '../../types';
import { getLastNDays } from '../date';

export const calculateAverages = (entries: WorkoutEntry[]) => {
  const { start: lastWeekStart } = getLastNDays(7);
  const { start: lastMonthStart } = getLastNDays(30);

  const lastWeekEntries = entries.filter(entry => entry.date >= lastWeekStart);
  const lastMonthEntries = entries.filter(entry => entry.date >= lastMonthStart);

  return {
    dailyCalories: Math.round(
      lastWeekEntries.reduce((sum, entry) => sum + entry.caloriesBurned, 0) / 7
    ),
    dailyDuration: Math.round(
      lastWeekEntries.reduce((sum, entry) => sum + entry.duration, 0) / 7
    ),
    monthlyCalories: Math.round(
      lastMonthEntries.reduce((sum, entry) => sum + entry.caloriesBurned, 0) / 30
    ),
    monthlyDuration: Math.round(
      lastMonthEntries.reduce((sum, entry) => sum + entry.duration, 0) / 30
    ),
  };
};