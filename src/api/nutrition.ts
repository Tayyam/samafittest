import type { AnalyzedMeal, FoodItem } from '../types/nutrition';

const extractQuantityAndUnit = (text: string): { 
  quantity?: string;
  unit?: string;
  food: string;
} => {
  // تعبير نمطي للبحث عن الأرقام والوحدات
  const regex = /^(\d+(?:\.\d+)?)\s*(حبة|جرام|كوب|ملعقة|قطعة|شريحة|حبات|اكواب|ملاعق|قطع|شرائح)?\s*(.+)$/i;
  const match = text.trim().match(regex);

  if (match) {
    return {
      quantity: match[1],
      unit: match[2],
      food: match[3].trim()
    };
  }

  return { food: text.trim() };
};

const detectMealType = (text: string): 'breakfast' | 'lunch' | 'dinner' | 'snack' | undefined => {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('فطور') || lowerText.includes('صباح')) {
    return 'breakfast';
  }
  if (lowerText.includes('غداء') || lowerText.includes('ظهر')) {
    return 'lunch';
  }
  if (lowerText.includes('عشاء') || lowerText.includes('مساء')) {
    return 'dinner';
  }
  if (lowerText.includes('سناك') || lowerText.includes('وجبة خفيفة')) {
    return 'snack';
  }
  
  return undefined;
};

const extractTime = (text: string): string | undefined => {
  const timeRegex = /(\d{1,2}(?::\d{2})?)\s*(?:ص|م|صباحاً|مساءً|صباحا|مساء)?/;
  const match = text.match(timeRegex);
  return match ? match[0] : undefined;
};

export const analyzeNutritionText = (text: string): AnalyzedMeal[] => {
  // تقسيم النص إلى وجبات منفصلة
  const mealSeparator = /[.،;\n]+/;
  const mealTexts = text.split(mealSeparator).filter(t => t.trim());

  return mealTexts.map(mealText => {
    const mealType = detectMealType(mealText);
    const time = extractTime(mealText);

    // تقسيم الوجبة إلى أطعمة منفصلة
    const foodTexts = mealText.split(/[,،&و]+/).map(t => t.trim()).filter(Boolean);
    
    const foods: FoodItem[] = foodTexts.map(foodText => {
      return extractQuantityAndUnit(foodText);
    });

    return {
      foods,
      mealType,
      time
    };
  });
}; 