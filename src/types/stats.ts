export interface ProgressPoint {
  date: string;
  exerciseId: string;
  avgWeight: number;
}

export interface PersonalBest {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  date: string;
}

export interface WorkoutStats {
  totalWorkouts: number;
  weeklyCompletion: number;
  monthlyCompletion: number;
  personalBests: PersonalBest[];
  progressData: ProgressPoint[];
  weakAreas: string[];
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  totalWorkouts: number;
  completionRate: number;
  avgDuration: number;
  totalSets: number;
  failedSets: number;
}