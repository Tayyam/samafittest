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