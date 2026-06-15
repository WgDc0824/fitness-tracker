import { WorkoutRecord, SetRecord } from '@/types/workout';
import { WorkoutStats, PersonalBest, ProgressPoint } from '@/types/stats';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO, isWithinInterval } from 'date-fns';

export function calculateStats(records: WorkoutRecord[]): WorkoutStats {
  const totalWorkouts = records.length;
  const weeklyCompletion = calculateWeeklyCompletion(records);
  const monthlyCompletion = calculateMonthlyCompletion(records);
  const personalBests = calculatePersonalBests(records);
  const progressData = calculateProgress(records);
  const weakAreas = analyzeWeakAreas(records);

  return {
    totalWorkouts,
    weeklyCompletion,
    monthlyCompletion,
    personalBests,
    progressData,
    weakAreas
  };
}

export function calculateWeeklyCompletion(records: WorkoutRecord[]): number {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const weeklyRecords = records.filter(record => {
    const recordDate = parseISO(record.date);
    return isWithinInterval(recordDate, { start: weekStart, end: weekEnd });
  });

  const completedDays = weeklyRecords.filter(r => r.completedAt).length;
  return Math.round((completedDays / 5) * 100);
}

export function calculateMonthlyCompletion(records: WorkoutRecord[]): number {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const monthlyRecords = records.filter(record => {
    const recordDate = parseISO(record.date);
    return isWithinInterval(recordDate, { start: monthStart, end: monthEnd });
  });

  const completedDays = monthlyRecords.filter(r => r.completedAt).length;
  const totalDaysInMonth = Math.ceil((monthEnd.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24));
  const expectedWorkouts = Math.min(totalDaysInMonth, 20);

  return Math.round((completedDays / expectedWorkouts) * 100);
}

export function calculatePersonalBests(records: WorkoutRecord[]): PersonalBest[] {
  const pbMap: Map<string, PersonalBest> = new Map();

  records.forEach(record => {
    record.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        const currentPB = pbMap.get(exercise.exerciseId);
        if (!currentPB || set.weight > currentPB.weight) {
          pbMap.set(exercise.exerciseId, {
            exerciseId: exercise.exerciseId,
            exerciseName: exercise.exerciseName,
            weight: set.weight,
            date: record.date
          });
        }
      });
    });
  });

  return Array.from(pbMap.values());
}

export function calculateProgress(records: WorkoutRecord[]): ProgressPoint[] {
  const progressMap: Map<string, Map<string, number[]>> = new Map();

  records.forEach(record => {
    record.exercises.forEach(exercise => {
      if (!progressMap.has(exercise.exerciseId)) {
        progressMap.set(exercise.exerciseId, new Map());
      }
      const dateMap = progressMap.get(exercise.exerciseId)!;

      if (!dateMap.has(record.date)) {
        dateMap.set(record.date, []);
      }

      exercise.sets.forEach(set => {
        dateMap.get(record.date)!.push(set.weight);
      });
    });
  });

  const progressData: ProgressPoint[] = [];
  progressMap.forEach((dateMap, exerciseId) => {
    dateMap.forEach((weights, date) => {
      const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length;
      progressData.push({
        date,
        exerciseId,
        avgWeight
      });
    });
  });

  return progressData.sort((a, b) => a.date.localeCompare(b.date));
}

export function analyzeWeakAreas(records: WorkoutRecord[]): string[] {
  const failedSetsMap: Map<string, number> = new Map();

  records.forEach(record => {
    record.exercises.forEach(exercise => {
      const failedSets = exercise.sets.filter(set => 
        set.actualReps < 12 || set.status === 'failure' || set.status === 'exhausted'
      ).length;

      if (failedSets > 0) {
        const current = failedSetsMap.get(exercise.exerciseName) || 0;
        failedSetsMap.set(exercise.exerciseName, current + failedSets);
      }
    });
  });

  const sortedWeakAreas = Array.from(failedSetsMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);

  return sortedWeakAreas;
}

export function isPersonalBest(
  exerciseId: string,
  weight: number,
  records: WorkoutRecord[]
): boolean {
  const pbs = calculatePersonalBests(records);
  const pb = pbs.find(p => p.exerciseId === exerciseId);
  return !pb || weight > pb.weight;
}

export function calculateAvgWeight(sets: SetRecord[]): number {
  if (sets.length === 0) return 0;
  return sets.reduce((sum, set) => sum + set.weight, 0) / sets.length;
}

export function calculateTotalDuration(records: WorkoutRecord[]): number {
  return records.reduce((sum, record) => sum + record.duration, 0);
}

export function calculateFailedSets(records: WorkoutRecord[]): number {
  return records.reduce((sum, record) => {
    return sum + record.exercises.reduce((exerciseSum, exercise) => {
      return exerciseSum + exercise.sets.filter(set =>
        set.actualReps < 12 || set.status === 'failure'
      ).length;
    }, 0);
  }, 0);
}