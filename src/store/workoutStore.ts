import { create } from 'zustand';
import { WorkoutRecord, ExerciseRecord, SetRecord, WorkoutNotes } from '@/types/workout';
import { UserSettings } from '@/types/settings';
import { DayType } from '@/types/training';
import { TRAINING_PLAN } from '@/data/trainingPlan';
import {
  saveWorkoutHistory,
  loadWorkoutHistory,
  saveCurrentWorkout,
  loadCurrentWorkout,
  saveSettings,
  loadSettings,
  clearAllData
} from '@/utils/localStorage';
import { exportToExcel } from '@/utils/exportData';
import { format } from 'date-fns';

interface WorkoutStore {
  workoutHistory: WorkoutRecord[];
  currentWorkout: WorkoutRecord | null;
  settings: UserSettings;
  startTime: number | null;

  loadHistory: () => void;
  loadSettings: () => void;
  loadCurrentWorkout: () => void;

  startWorkout: (date: string, dayType: DayType) => void;
  updateExerciseSet: (exerciseId: string, setNumber: number, setData: Partial<SetRecord>) => void;
  updateNotes: (notes: Partial<WorkoutNotes>) => void;
  completeWorkout: () => void;

  updateSettings: (settings: Partial<UserSettings>) => void;
  clearAllData: () => void;
  exportData: () => void;

  getWorkoutByDate: (date: string) => WorkoutRecord | undefined;
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  workoutHistory: [],
  currentWorkout: null,
  settings: {
    restTime: 90,
    enableNotifications: false,
    theme: 'dark'
  },
  startTime: null,

  loadHistory: () => {
    const history = loadWorkoutHistory();
    set({ workoutHistory: history });
  },

  loadSettings: () => {
    const settings = loadSettings();
    set({ settings });
  },

  loadCurrentWorkout: () => {
    const workout = loadCurrentWorkout();
    if (workout) {
      set({ currentWorkout: workout });
    }
  },

  startWorkout: (date: string, dayType: DayType) => {
    const trainingDay = TRAINING_PLAN.find(day => day.type === dayType);
    if (!trainingDay) return;

    const exercises: ExerciseRecord[] = trainingDay.exercises.map(exercise => ({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: Array.from({ length: exercise.sets }, (_, i) => ({
        setNumber: i + 1,
        weight: 0,
        actualReps: exercise.reps,
        restTime: trainingDay.restTime,
        status: 'normal' as const,
        note: ''
      }))
    }));

    const workout: WorkoutRecord = {
      id: `${date}_${dayType}`,
      date,
      dayType,
      exercises,
      notes: {
        bodyCondition: 7,
        warmup: false,
        stretching: false
      },
      duration: 0
    };

    set({ currentWorkout: workout, startTime: Date.now() });
    saveCurrentWorkout(workout);
  },

  updateExerciseSet: (exerciseId: string, setNumber: number, setData: Partial<SetRecord>) => {
    const { currentWorkout } = get();
    if (!currentWorkout) return;

    const updatedExercises = currentWorkout.exercises.map(exercise => {
      if (exercise.exerciseId !== exerciseId) return exercise;

      const updatedSets = exercise.sets.map(set => {
        if (set.setNumber !== setNumber) return set;
        return { ...set, ...setData };
      });

      return { ...exercise, sets: updatedSets };
    });

    const updatedWorkout = { ...currentWorkout, exercises: updatedExercises };
    set({ currentWorkout: updatedWorkout });
    saveCurrentWorkout(updatedWorkout);
  },

  updateNotes: (notes: Partial<WorkoutNotes>) => {
    const { currentWorkout } = get();
    if (!currentWorkout) return;

    const updatedWorkout = {
      ...currentWorkout,
      notes: { ...currentWorkout.notes, ...notes }
    };
    set({ currentWorkout: updatedWorkout });
    saveCurrentWorkout(updatedWorkout);
  },

  completeWorkout: () => {
    const { currentWorkout, startTime, workoutHistory } = get();
    if (!currentWorkout || !startTime) return;

    const duration = Math.round((Date.now() - startTime) / 60000);
    const completedWorkout: WorkoutRecord = {
      ...currentWorkout,
      duration,
      completedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    };

    const newHistory = [...workoutHistory, completedWorkout];
    set({
      workoutHistory: newHistory,
      currentWorkout: null,
      startTime: null
    });

    saveWorkoutHistory(newHistory);
    saveCurrentWorkout(null);
  },

  updateSettings: (newSettings: Partial<UserSettings>) => {
    const { settings } = get();
    const updatedSettings = { ...settings, ...newSettings };
    set({ settings: updatedSettings });
    saveSettings(updatedSettings);
  },

  clearAllData: () => {
    clearAllData();
    set({
      workoutHistory: [],
      currentWorkout: null,
      settings: {
        restTime: 90,
        enableNotifications: false,
        theme: 'dark'
      }
    });
  },

  exportData: () => {
    const { workoutHistory } = get();
    exportToExcel(workoutHistory);
  },

  getWorkoutByDate: (date: string) => {
    const { workoutHistory } = get();
    return workoutHistory.find(record => record.date === date);
  }
}));