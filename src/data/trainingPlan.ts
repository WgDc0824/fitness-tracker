import { TrainingDay } from '@/types/training';

export const TRAINING_PLAN: TrainingDay[] = [
  {
    day: 1,
    type: 'chest',
    name: '胸部日',
    restTime: 90,
    exercises: [
      {
        id: 'chest_1',
        name: '平板哑铃卧推',
        sets: 4,
        reps: 12,
        muscleGroup: '胸大肌',
        videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h6'
      },
      {
        id: 'chest_2',
        name: '上斜器械推胸',
        sets: 4,
        reps: 12,
        muscleGroup: '上胸',
        videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h6'
      },
      {
        id: 'chest_3',
        name: '绳索夹胸',
        sets: 4,
        reps: 12,
        muscleGroup: '胸大肌',
        videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h6'
      },
      {
        id: 'chest_4',
        name: '胸式双杠臂屈伸',
        sets: 4,
        reps: 12,
        muscleGroup: '下胸',
        videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h6'
      }
    ]
  },
  {
    day: 2,
    type: 'back',
    name: '背部日',
    restTime: 90,
    exercises: [
      {
        id: 'back_1',
        name: '宽距高位下拉',
        sets: 4,
        reps: 12,
        muscleGroup: '背阔肌',
        videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h6'
      },
      {
        id: 'back_2',
        name: '坐姿绳索划船',
        sets: 4,
        reps: 12,
        muscleGroup: '背阔肌',
        videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h6'
      },
      {
        id: 'back_3',
        name: '单臂哑铃划船',
        sets: 4,
        reps: 12,
        muscleGroup: '背阔肌',
        videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h6'
      },
      {
        id: 'back_4',
        name: '直臂下压',
        sets: 4,
        reps: 12,
        muscleGroup: '背阔肌',
        videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h6'
      }
    ]
  },
  {
    day: 3,
    type: 'shoulders',
    name: '肩部日',
    restTime: 90,
    exercises: [
      {
        id: 'shoulders_1',
        name: '坐姿哑铃推举',
        sets: 4,
        reps: 12,
        muscleGroup: '三角肌前束',
        videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h6'
      },
      {
        id: 'shoulders_2',
        name: '哑铃侧平举',
        sets: 4,
        reps: 12,
        muscleGroup: '三角肌中束',
        videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h6'
      },
      {
        id: 'shoulders_3',
        name: '绳索面拉',
        sets: 4,
        reps: 12,
        muscleGroup: '三角肌后束',
        videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h6'
      },
      {
        id: 'shoulders_4',
        name: '俯身哑铃后束飞鸟',
        sets: 4,
        reps: 12,
        muscleGroup: '三角肌后束',
        videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h6'
      }
    ]
  },
  {
    day: 4,
    type: 'arms',
    name: '手臂日',
    restTime: 90,
    exercises: [
      {
        id: 'arms_1',
        name: '绳索三头下压',
        sets: 4,
        reps: 12,
        muscleGroup: '肱三头肌',
        videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h6'
      },
      {
        id: 'arms_2',
        name: '仰卧杠铃臂屈伸',
        sets: 4,
        reps: 12,
        muscleGroup: '肱三头肌',
        videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h6'
      },
      {
        id: 'arms_3',
        name: '站姿杠铃弯举',
        sets: 4,
        reps: 12,
        muscleGroup: '肱二头肌',
        videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h6'
      },
      {
        id: 'arms_4',
        name: '哑铃交替弯举',
        sets: 4,
        reps: 12,
        muscleGroup: '肱二头肌',
        videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h6'
      }
    ]
  },
  {
    day: 5,
    type: 'core',
    name: '核心日',
    restTime: 45,
    exercises: [
      {
        id: 'core_1',
        name: '绳索卷腹',
        sets: 4,
        reps: 12,
        muscleGroup: '腹直肌',
        videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h6'
      },
      {
        id: 'core_2',
        name: '死虫式',
        sets: 4,
        reps: 12,
        muscleGroup: '核心肌群',
        videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h6'
      },
      {
        id: 'core_3',
        name: '标准平板支撑',
        sets: 4,
        reps: 60,
        muscleGroup: '核心肌群',
        videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h6'
      },
      {
        id: 'core_4',
        name: '侧平板支撑',
        sets: 4,
        reps: 60,
        muscleGroup: '核心肌群',
        videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h6'
      }
    ]
  }
];

export const TRAINING_RULES = {
  weeklyFrequency: 5,
  restDays: 2,
  standardReps: 12,
  standardSets: 4,
  strengthRestTime: '60-90秒',
  coreRestTime: '45秒',
  goal: '每组12次，重量循序渐进提升',
  rule: '全程无任何下肢训练动作'
};

export function getTrainingDayByDate(date: Date): TrainingDay | null {
  const dayOfWeek = date.getDay();
  const dayNumber = dayOfWeek === 0 ? 7 : dayOfWeek;
  
  if (dayNumber > 5) {
    return null;
  }
  
  return TRAINING_PLAN.find(day => day.day === dayNumber) || null;
}

export function getExerciseById(exerciseId: string) {
  for (const day of TRAINING_PLAN) {
    const exercise = day.exercises.find(e => e.id === exerciseId);
    if (exercise) {
      return { exercise, trainingDay: day };
    }
  }
  return null;
}