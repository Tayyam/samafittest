import type { WorkoutEntry } from '../../types';

export const calculateTotalCalories = (entries: WorkoutEntry[]): number => {
  return entries.reduce((sum, entry) => sum + entry.caloriesBurned, 0);
};

export const calculateTotalDuration = (entries: WorkoutEntry[]): number => {
  return entries.reduce((sum, entry) => sum + entry.duration, 0);
};

export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

export const groupWorkoutsByType = (entries: WorkoutEntry[]) => {
  return entries.reduce((acc, entry) => {
    const type = entry.exercise.toLowerCase();
    if (!acc[type]) {
      acc[type] = { calories: 0, duration: 0, name: type };
    }
    acc[type].calories += entry.caloriesBurned;
    acc[type].duration += entry.duration;
    return acc;
  }, {} as Record<string, { name: string; calories: number; duration: number }>);
};