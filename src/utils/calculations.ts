export const calculateBMR = (weight: number, height: number, age: number, gender: 'male' | 'female'): number => {
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  }
  return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
};

export const calculateCaloriesBurned = (
  exercise: string,
  duration: number,
  weight: number
): number => {
  // Simplified calculation - in a real app, this would be more complex
  const metValues: Record<string, number> = {
    running: 8,
    walking: 3.5,
    cycling: 7,
    swimming: 6,
    weightlifting: 3
  };

  const met = metValues[exercise.toLowerCase()] || 4;
  return Math.round((met * 3.5 * weight * duration) / 200);
};