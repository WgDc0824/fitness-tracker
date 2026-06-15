import * as XLSX from 'xlsx';
import { WorkoutRecord } from '@/types/workout';
import { DAY_TYPE_NAMES } from '@/types/training';
import { SET_STATUS_NAMES } from '@/types/workout';

export function exportToExcel(records: WorkoutRecord[]) {
  const data = records.flatMap(record =>
    record.exercises.flatMap(exercise =>
      exercise.sets.map(set => ({
        日期: record.date,
        训练部位: DAY_TYPE_NAMES[record.dayType],
        动作名称: exercise.exerciseName,
        组数: set.setNumber,
        重量_kg: set.weight,
        实际次数: set.actualReps,
        休息时长_秒: set.restTime,
        训练状态: SET_STATUS_NAMES[set.status],
        备注: set.note || '',
        身体状态评分: record.notes.bodyCondition,
        睡眠情况: record.notes.sleepQuality || '',
        训练体感: record.notes.feeling || '',
        补剂: record.notes.supplements || '',
        饮食: record.notes.diet || '',
        伤病情况: record.notes.injury || '',
        热身: record.notes.warmup ? '已完成' : '未完成',
        拉伸: record.notes.stretching ? '已完成' : '未完成',
        总训练时长_分钟: record.duration,
        完成时间: record.completedAt || ''
      }))
    )
  );

  const worksheet = XLSX.utils.json_to_sheet(data);
  
  const columnWidths = [
    { wch: 12 }, { wch: 10 }, { wch: 20 }, { wch: 6 },
    { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 12 },
    { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
    { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 10 },
    { wch: 10 }, { wch: 14 }, { wch: 20 }
  ];
  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '训练记录');

  const today = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `健身打卡记录_${today}.xlsx`);
}

export function generateWeeklyReport(records: WorkoutRecord[], weekStart: string, weekEnd: string) {
  const weekRecords = records.filter(record =>
    record.date >= weekStart && record.date <= weekEnd && record.completedAt
  );

  const totalWorkouts = weekRecords.length;
  const totalDuration = weekRecords.reduce((sum, r) => sum + r.duration, 0);
  const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
  const totalSets = weekRecords.reduce((sum, r) =>
    sum + r.exercises.reduce((eSum, e) => eSum + e.sets.length, 0), 0
  );

  const failedSets = weekRecords.reduce((sum, r) =>
    sum + r.exercises.reduce((eSum, e) =>
      eSum + e.sets.filter(s => s.actualReps < 12 || s.status === 'failure').length, 0
    ), 0
  );

  const avgBodyCondition = weekRecords.length > 0
    ? Math.round(weekRecords.reduce((sum, r) => sum + r.notes.bodyCondition, 0) / weekRecords.length)
    : 0;

  const weakAreas = analyzeWeeklyWeakAreas(weekRecords);

  return {
    weekStart,
    weekEnd,
    totalWorkouts,
    completionRate: Math.round((totalWorkouts / 5) * 100),
    avgDuration,
    totalSets,
    failedSets,
    avgBodyCondition,
    weakAreas
  };
}

function analyzeWeeklyWeakAreas(records: WorkoutRecord[]): string[] {
  const failedSetsMap: Map<string, number> = new Map();

  records.forEach(record => {
    record.exercises.forEach(exercise => {
      const failedSets = exercise.sets.filter(set =>
        set.actualReps < 12 || set.status === 'failure'
      ).length;

      if (failedSets > 0) {
        const current = failedSetsMap.get(exercise.exerciseName) || 0;
        failedSetsMap.set(exercise.exerciseName, current + failedSets);
      }
    });
  });

  return Array.from(failedSetsMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => `${name}(${count}组未达标)`);
}