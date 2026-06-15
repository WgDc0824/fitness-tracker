import { WorkoutRecord } from '@/types/workout';
import { UserSettings, DEFAULT_SETTINGS } from '@/types/settings';

const STORAGE_KEYS = {
  WORKOUT_HISTORY: 'fitness_tracker_workout_history',
  CURRENT_WORKOUT: 'fitness_tracker_current_workout',
  SETTINGS: 'fitness_tracker_settings'
};

export function saveWorkoutHistory(history: WorkoutRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('保存训练历史失败:', error);
  }
}

export function loadWorkoutHistory(): WorkoutRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('加载训练历史失败:', error);
    return [];
  }
}

export function saveCurrentWorkout(workout: WorkoutRecord | null) {
  try {
    if (workout) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_WORKOUT, JSON.stringify(workout));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_WORKOUT);
    }
  } catch (error) {
    console.error('保存当前训练失败:', error);
  }
}

export function loadCurrentWorkout(): WorkoutRecord | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_WORKOUT);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('加载当前训练失败:', error);
    return null;
  }
}

export function saveSettings(settings: UserSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('保存设置失败:', error);
  }
}

export function loadSettings(): UserSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('加载设置失败:', error);
    return DEFAULT_SETTINGS;
  }
}

export function clearAllData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.WORKOUT_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_WORKOUT);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  } catch (error) {
    console.error('清空数据失败:', error);
  }
}

export function getWorkoutByDate(date: string): WorkoutRecord | undefined {
  const history = loadWorkoutHistory();
  return history.find(record => record.date === date);
}

export function getWorkoutsByExercise(exerciseId: string): WorkoutRecord[] {
  const history = loadWorkoutHistory();
  return history.filter(record =>
    record.exercises.some(e => e.exerciseId === exerciseId)
  );
}