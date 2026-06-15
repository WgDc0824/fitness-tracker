export type DayType = 'chest' | 'back' | 'shoulders' | 'arms' | 'core' | 'rest';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  videoUrl?: string;
  muscleGroup: string;
}

export interface TrainingDay {
  day: number;
  type: DayType;
  name: string;
  exercises: Exercise[];
  restTime: number;
}

export const DAY_TYPE_NAMES: Record<DayType, string> = {
  chest: '胸部日',
  back: '背部日',
  shoulders: '肩部日',
  arms: '手臂日',
  core: '核心日',
  rest: '休息日'
};

export const DAY_TYPE_COLORS: Record<DayType, string> = {
  chest: '#ef4444',
  back: '#3b82f6',
  shoulders: '#f59e0b',
  arms: '#8b5cf6',
  core: '#10b981',
  rest: '#6b7280'
};