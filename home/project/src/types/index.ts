// User Types
export type UserRole = 'admin' | 'trainer' | 'member';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  trainerId?: string;
  membersCount?: number;
}

// Nutrition Types
export interface NutritionEntry {
  id: string;
  userId: string;
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date: Date;
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface MacroProgress {
  current: number;
  goal: number;
}

export interface NutritionProgress {
  protein: MacroProgress;
  carbs: MacroProgress;
  fats: MacroProgress;
}

// Workout Types
export interface WorkoutEntry {
  id: string;
  userId: string;
  exercise: string;
  duration: number;
  caloriesBurned: number;
  date: Date;
}

export interface WorkoutSummary {
  totalCalories: number;
  totalDuration: number;
  caloriesChange: number;
  durationChange: number;
}

// InBody Types
export interface InBodyData {
  id: string;
  userId: string;
  weight: number;
  muscleMass: number;
  fatPercentage: number;
  score: number;
  date: Date;
}

export interface InBodyStats {
  currentWeight: number;
  currentMuscle: number;
  currentFat: number;
  weightChange: number;
  muscleChange: number;
  fatChange: number;
}

// Ranking Types
export interface RankingData {
  userId: string;
  name: string;
  score: number;
  progress: number;
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  averageScore: number;
  totalWorkouts: number;
  userGrowth: number;
  activeUsersGrowth: number;
  scoreGrowth: number;
  workoutGrowth: number;
  dailyActiveUsers: number;
  averageSessionTime: number;
  totalMeasurements: number;
  totalMeals: number;
}

// Trainer Types
export interface TrainerMember {
  id: string;
  name: string;
  email: string;
  lastActivity: Date;
  currentScore: number;
  progress: number;
  currentWeight: number;
  weightChange: number;
  weeklyWorkouts: number;
  workoutChange: number;
  progressHistory: {
    date: string;
    score: number;
  }[];
}

export interface TrainerStats {
  totalMembers: number;
  activeMembers: number;
  averageScore: number;
  memberGrowth: number;
  scoreGrowth: number;
  activityGrowth: number;
}

// Notification Types
export type NotificationType = 
  | 'nutrition'    // تذكير بتسجيل الوجبات
  | 'workout'      // تذكير بتسجيل التمارين
  | 'inbody'       // موعد قياس جديد
  | 'achievement'  // إنجاز جديد
  | 'assignment'   // تعيين مدرب جديد
  | 'system';      // إشعارات النظام

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  link?: string;
  data?: Record<string, any>;
}

// Export Types
export interface ExportOptions {
  format: 'pdf' | 'excel';
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeCharts?: boolean;
}

export interface ExportData {
  title: string;
  headers: string[];
  rows: any[][];
  charts?: {
    title: string;
    data: any[];
    type: 'line' | 'bar' | 'pie';
  }[];
}