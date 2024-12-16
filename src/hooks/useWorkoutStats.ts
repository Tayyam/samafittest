import { useMemo } from 'react';
import type { WorkoutEntry } from '../types';
import { 
  calculateTotalCalories,
  calculateTotalDuration,
  calculatePercentageChange,
  groupWorkoutsByType
} from '../utils/workout/calculations';
import { calculateAverages } from '../utils/workout/averages';

export const useWorkoutStats = (entries: WorkoutEntry[]) => {
  const summary = useMemo(() => {
    const totalCalories = calculateTotalCalories(entries);
    const totalDuration = calculateTotalDuration(entries);
    const averages = calculateAverages(entries);

    return {
      totalCalories,
      totalDuration,
      caloriesChange: calculatePercentageChange(totalCalories, averages.dailyCalories),
      durationChange: calculatePercentageChange(totalDuration, averages.dailyDuration)
    };
  }, [entries]);

  const chartData = useMemo(() => {
    const groupedWorkouts = groupWorkoutsByType(entries);
    return Object.values(groupedWorkouts);
  }, [entries]);

  return {
    summary,
    chartData
  };
};