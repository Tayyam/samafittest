import { useMemo } from 'react';
import type { InBodyData } from '../types';

export const useInBodyProgress = (data: InBodyData[]) => {
  const stats = useMemo(() => {
    if (data.length === 0) {
      return {
        currentWeight: 0,
        currentMuscle: 0,
        currentFat: 0,
        weightChange: 0,
        muscleChange: 0,
        fatChange: 0
      };
    }

    const current = data[0];
    const previous = data[1];

    return {
      currentWeight: current.weight,
      currentMuscle: current.muscleMass,
      currentFat: current.fatPercentage,
      weightChange: previous ? +(current.weight - previous.weight).toFixed(1) : 0,
      muscleChange: previous ? +(current.muscleMass - previous.muscleMass).toFixed(1) : 0,
      fatChange: previous ? +(current.fatPercentage - previous.fatPercentage).toFixed(1) : 0
    };
  }, [data]);

  const chartData = useMemo(() => {
    return data
      .slice()
      .reverse()
      .map(entry => ({
        date: entry.date.toISOString(),
        weight: entry.weight,
        muscleMass: entry.muscleMass,
        fatPercentage: entry.fatPercentage
      }));
  }, [data]);

  return {
    stats,
    chartData
  };
};