import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { NumberInput } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Timer } from '@/components/ui/Timer';
import { useWorkoutStore } from '@/store/workoutStore';
import { TRAINING_PLAN, getTrainingDayByDate } from '@/data/trainingPlan';
import { DAY_TYPE_NAMES, DAY_TYPE_COLORS } from '@/types/training';
import { SET_STATUS_NAMES, SetStatus } from '@/types/workout';
import { isPersonalBest } from '@/utils/statsCalculator';
import { ArrowLeft, Play, Video, Copy, RotateCcw, CheckCircle, AlertTriangle, Star } from 'lucide-react';

export function Workout() {
  const { date } = useParams();
  const navigate = useNavigate();
  const {
    currentWorkout,
    workoutHistory,
    startWorkout,
    updateExerciseSet,
    updateNotes,
    completeWorkout,
    loadHistory,
    loadCurrentWorkout
  } = useWorkoutStore();

  const [activeTimers, setActiveTimers] = useState<Record<string, number>>({});
  const [showPBAlert, setShowPBAlert] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
    loadCurrentWorkout();
  }, [loadHistory, loadCurrentWorkout]);

  useEffect(() => {
    if (date && !currentWorkout) {
      const workoutDate = parseISO(date);
      const trainingDay = getTrainingDayByDate(workoutDate);
      
      if (trainingDay) {
        startWorkout(date, trainingDay.type);
      }
    }
  }, [date, currentWorkout, startWorkout]);

  const handleWeightChange = (exerciseId: string, setNumber: number, weight: number) => {
    updateExerciseSet(exerciseId, setNumber, { weight });

    if (weight > 0 && isPersonalBest(exerciseId, weight, workoutHistory)) {
      setShowPBAlert(`${exerciseId}_${setNumber}`);
      setTimeout(() => setShowPBAlert(null), 3000);
    }
  };

  const handleRepsChange = (exerciseId: string, setNumber: number, reps: number) => {
    updateExerciseSet(exerciseId, setNumber, { actualReps: reps });
  };

  const handleRestTimeChange = (exerciseId: string, setNumber: number, restTime: number) => {
    updateExerciseSet(exerciseId, setNumber, { restTime });
  };

  const handleStatusChange = (exerciseId: string, setNumber: number, status: SetStatus) => {
    updateExerciseSet(exerciseId, setNumber, { status });
  };

  const handleNoteChange = (exerciseId: string, setNumber: number, note: string) => {
    updateExerciseSet(exerciseId, setNumber, { note });
  };

  const copyPreviousWeight = (exerciseId: string, setNumber: number) => {
    if (!currentWorkout) return;
    
    const exercise = currentWorkout.exercises.find(e => e.exerciseId === exerciseId);
    if (!exercise) return;

    const previousSet = exercise.sets.find(s => s.setNumber === setNumber - 1);
    if (previousSet && previousSet.weight > 0) {
      updateExerciseSet(exerciseId, setNumber, { weight: previousSet.weight });
    }
  };

  const fillAllSetsWithFirstWeight = (exerciseId: string) => {
    if (!currentWorkout) return;
    
    const exercise = currentWorkout.exercises.find(e => e.exerciseId === exerciseId);
    if (!exercise) return;

    const firstSet = exercise.sets.find(s => s.setNumber === 1);
    if (!firstSet || firstSet.weight === 0) return;

    exercise.sets.forEach(set => {
      if (set.setNumber !== 1) {
        updateExerciseSet(exerciseId, set.setNumber, { weight: firstSet.weight });
      }
    });
  };

  const resetSet = (exerciseId: string, setNumber: number) => {
    const trainingDay = TRAINING_PLAN.find(day => day.type === currentWorkout?.dayType);
    const exercise = trainingDay?.exercises.find(e => e.id === exerciseId);
    
    if (exercise && trainingDay) {
      updateExerciseSet(exerciseId, setNumber, {
        weight: 0,
        actualReps: exercise.reps,
        restTime: trainingDay.restTime,
        status: 'normal',
        note: ''
      });
    }
  };

  const startRestTimer = (exerciseId: string, setNumber: number, seconds: number) => {
    const key = `${exerciseId}_${setNumber}`;
    setActiveTimers(prev => ({ ...prev, [key]: seconds }));
  };

  const closeTimer = (exerciseId: string, setNumber: number) => {
    const key = `${exerciseId}_${setNumber}`;
    setActiveTimers(prev => {
      const newTimers = { ...prev };
      delete newTimers[key];
      return newTimers;
    });
  };

  const handleTimerComplete = (exerciseId: string, setNumber: number) => {
    closeTimer(exerciseId, setNumber);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('休息结束', { body: '开始下一组训练！' });
    }
  };

  const handleCompleteWorkout = () => {
    completeWorkout();
    navigate('/');
  };

  const isWorkoutComplete = () => {
    if (!currentWorkout) return false;
    
    return currentWorkout.exercises.every(exercise =>
      exercise.sets.every(set => set.weight > 0)
    );
  };

  const trainingDay = currentWorkout
    ? TRAINING_PLAN.find(day => day.type === currentWorkout.dayType)
    : null;

  if (!currentWorkout || !trainingDay) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">加载训练数据...</div>
          <Button onClick={() => navigate('/')}>返回首页</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <header className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft size={20} className="mr-2" />
            返回
          </Button>
          <div className="mt-4">
            <h1 className="text-2xl font-bold" style={{ color: DAY_TYPE_COLORS[currentWorkout.dayType] }}>
              {DAY_TYPE_NAMES[currentWorkout.dayType]}
            </h1>
            <div className="text-gray-400 mt-1">
              {format(parseISO(currentWorkout.date), 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
            </div>
          </div>
        </header>

        {showPBAlert && (
          <div className="mb-4 fixed top-4 right-4 z-50">
            <Card variant="elevated" className="bg-yellow-900/20 border-yellow-500 animate-pulse">
              <CardContent className="flex items-center gap-3">
                <Star className="text-yellow-500" size={24} />
                <div>
                  <div className="font-semibold text-yellow-500">突破个人最佳！</div>
                  <div className="text-sm text-gray-400">新的PB记录诞生</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="space-y-4">
          {currentWorkout.exercises.map((exercise, exerciseIndex) => (
            <Card key={exercise.exerciseId} variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    <span className="text-orange-500 mr-2">{exerciseIndex + 1}.</span>
                    {exercise.exerciseName}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fillAllSetsWithFirstWeight(exercise.exerciseId)}
                      className="text-orange-400 border-orange-500/30 hover:bg-orange-500/10"
                    >
                      <Copy size={14} className="mr-1" />
                      一键填充
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(trainingDay.exercises[exerciseIndex].videoUrl, '_blank')}
                    >
                      <Video size={16} />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>目标 {exercise.sets.length}组 × {exercise.reps}次</span>
                  <span>组间休息 {trainingDay.restTime}秒</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exercise.sets.map((set, setIndex) => (
                    <div key={set.setNumber} className="border-b border-gray-700 pb-3 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-semibold text-gray-400">
                          第 {set.setNumber} 组
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyPreviousWeight(exercise.exerciseId, set.setNumber)}
                            disabled={set.setNumber === 1}
                          >
                            <Copy size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => resetSet(exercise.exerciseId, set.setNumber)}
                          >
                            <RotateCcw size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startRestTimer(exercise.exerciseId, set.setNumber, set.restTime)}
                          >
                            <Play size={14} />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <NumberInput
                          label="重量(kg)"
                          value={set.weight}
                          onChange={(value) => handleWeightChange(exercise.exerciseId, set.setNumber, value)}
                          min={0}
                          max={500}
                          step={0.5}
                        />
                        <NumberInput
                          label="次数"
                          value={set.actualReps}
                          onChange={(value) => handleRepsChange(exercise.exerciseId, set.setNumber, value)}
                          min={0}
                          max={100}
                        />
                        <NumberInput
                          label="休息(秒)"
                          value={set.restTime}
                          onChange={(value) => handleRestTimeChange(exercise.exerciseId, set.setNumber, value)}
                          min={0}
                          max={300}
                        />
                        <Select
                          label="状态"
                          value={set.status}
                          onChange={(e) => handleStatusChange(exercise.exerciseId, set.setNumber, e.target.value as SetStatus)}
                          options={Object.entries(SET_STATUS_NAMES).map(([value, label]) => ({
                            value,
                            label
                          }))}
                        />
                      </div>

                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="小组备注（可选）"
                          value={set.note || ''}
                          onChange={(e) => handleNoteChange(exercise.exerciseId, set.setNumber, e.target.value)}
                          className="w-full px-3 py-1.5 rounded bg-gray-900 border border-gray-700 text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                        />
                      </div>

                      {(() => {
                        const timerKey = `${exercise.exerciseId}_${set.setNumber}`;
                        const timerSeconds = activeTimers[timerKey];
                        if (!timerSeconds) return null;
                        return (
                          <div className="mt-3 p-3 rounded-lg bg-orange-900/30 border border-orange-500/50">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-gray-400 mb-1">组间休息</div>
                                <Timer
                                  key={timerKey}
                                  initialSeconds={timerSeconds}
                                  onComplete={() => handleTimerComplete(exercise.exerciseId, set.setNumber)}
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => closeTimer(exercise.exerciseId, set.setNumber)}
                              >
                                关闭
                              </Button>
                            </div>
                          </div>
                        );
                      })()}

                      {set.actualReps < 12 && set.weight > 0 && (
                        <div className="mt-2 flex items-center gap-2 text-yellow-500 text-sm">
                          <AlertTriangle size={14} />
                          未达标：目标12次，实际{set.actualReps}次
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {trainingDay.stretchExercises.length > 0 && (
          <div className="mt-6">
            <Card variant="elevated" className="border-green-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-green-400">训练后拉伸</CardTitle>
                  <Video size={16} className="text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trainingDay.stretchExercises.map((stretch, index) => (
                    <div key={stretch.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-green-500 font-semibold">{index + 1}.</span>
                          <span className="font-medium">{stretch.name}</span>
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {stretch.muscleGroup} · {stretch.duration}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(stretch.videoUrl, '_blank')}
                      >
                        <Play size={16} className="text-green-400" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>每日备注</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <NumberInput
                    label="身体状态评分"
                    value={currentWorkout.notes.bodyCondition}
                    onChange={(value) => updateNotes({ bodyCondition: value })}
                    min={1}
                    max={10}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={currentWorkout.notes.warmup || false}
                      onChange={(e) => updateNotes({ warmup: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-orange-500 focus:ring-orange-500"
                    />
                    <label className="text-sm text-gray-400">已完成热身</label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="睡眠情况"
                    value={currentWorkout.notes.sleepQuality || ''}
                    onChange={(e) => updateNotes({ sleepQuality: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="训练体感"
                    value={currentWorkout.notes.feeling || ''}
                    onChange={(e) => updateNotes({ feeling: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="补剂"
                    value={currentWorkout.notes.supplements || ''}
                    onChange={(e) => updateNotes({ supplements: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="饮食"
                    value={currentWorkout.notes.diet || ''}
                    onChange={(e) => updateNotes({ diet: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <input
                  type="text"
                  placeholder="伤病情况（如肩袖酸胀、手臂乏力等）"
                  value={currentWorkout.notes.injury || ''}
                  onChange={(e) => updateNotes({ injury: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                />

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={currentWorkout.notes.stretching || false}
                    onChange={(e) => updateNotes({ stretching: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-orange-500 focus:ring-orange-500"
                  />
                  <label className="text-sm text-gray-400">已完成拉伸</label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
          <div className="max-w-4xl mx-auto">
            <Button
              variant={isWorkoutComplete() ? 'primary' : 'secondary'}
              size="lg"
              className="w-full"
              onClick={handleCompleteWorkout}
              disabled={!isWorkoutComplete()}
            >
              <CheckCircle size={20} className="mr-2" />
              {isWorkoutComplete() ? '完成打卡' : '请填写所有组数据'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}