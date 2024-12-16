export interface FoodItem {
  food: string;
  quantity?: string;
  unit?: string;
}

export interface AnalyzedMeal {
  foods: FoodItem[];
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time?: string;
}

export interface NutritionAnalysis {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  food: string;
  quantity?: string;
  unit?: string;
}

export interface SavedFood extends NutritionAnalysis {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
}

export interface NutritionFormData {
  food: string;
  quantity?: number;
  unit?: string;
}

export interface NutritionEntry {
  id: string;
  food: string;
  amount: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  userId: string;
  date: Date;
}