export type SetStatus = 'normal' | 'failure' | 'exhausted' | 'good_form';

export const SET_STATUS_NAMES: Record<SetStatus, string> = {
  normal: '正常力竭',
  failure: '余力充足',
  exhausted: '力竭过早',
  good_form: '动作变形'
};

export interface SetRecord {
  setNumber: number;
  weight: number;
  actualReps: number;
  restTime: number;
  status: SetStatus;
  note?: string;
}

export interface ExerciseRecord {
  exerciseId: string;
  exerciseName: string;
  sets: SetRecord[];
}

export interface WorkoutNotes {
  bodyCondition: number;
  sleepQuality?: string;
  feeling?: string;
  supplements?: string;
  diet?: string;
  injury?: string;
  warmup?: boolean;
  stretching?: boolean;
}

export interface WorkoutRecord {
  id: string;
  date: string;
  dayType: import('./training').DayType;
  exercises: ExerciseRecord[];
  notes: WorkoutNotes;
  duration: number;
  completedAt?: string;
}