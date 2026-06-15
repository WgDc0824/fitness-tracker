import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useWorkoutStore } from '@/store/workoutStore';
import { DAY_TYPE_NAMES, DAY_TYPE_COLORS } from '@/types/training';
import { SET_STATUS_NAMES } from '@/types/workout';
import { ArrowLeft, Calendar, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

export function History() {
  const navigate = useNavigate();
  const { workoutHistory, loadHistory } = useWorkoutStore();
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const sortedHistory = [...workoutHistory]
    .filter(r => r.completedAt)
    .sort((a, b) => b.date.localeCompare(a.date));

  const getFailedSetsCount = (workout: typeof workoutHistory[0]) => {
    return workout.exercises.reduce((sum, exercise) => {
      return sum + exercise.sets.filter(set =>
        set.actualReps < 12 || set.status === 'failure'
      ).length;
    }, 0);
  };

  const getAvgWeight = (workout: typeof workoutHistory[0]) => {
    const allWeights = workout.exercises.flatMap(e => e.sets.map(s => s.weight));
    if (allWeights.length === 0) return 0;
    return Math.round(allWeights.reduce((sum, w) => sum + w, 0) / allWeights.length);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <header className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft size={20} className="mr-2" />
            返回首页
          </Button>
          <h1 className="text-2xl font-bold mt-4">历史训练记录</h1>
          <p className="text-gray-400 mt-1">查看过往训练数据</p>
        </header>

        {sortedHistory.length === 0 ? (
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <Calendar size={48} className="mx-auto mb-4 text-gray-500" />
                <div className="text-xl text-gray-400 mb-2">暂无训练记录</div>
                <div className="text-sm text-gray-500">开始你的第一次训练吧！</div>
                <Button
                  variant="primary"
                  size="lg"
                  className="mt-6"
                  onClick={() => navigate('/')}
                >
                  开始训练
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedHistory.map((workout) => (
              <Card
                key={workout.id}
                variant="elevated"
                className="cursor-pointer hover:bg-gray-750 transition-colors"
                onClick={() => setSelectedWorkout(
                  selectedWorkout === workout.id ? null : workout.id
                )}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        <span style={{ color: DAY_TYPE_COLORS[workout.dayType] }}>
                          {DAY_TYPE_NAMES[workout.dayType]}
                        </span>
                      </CardTitle>
                      <div className="text-sm text-gray-400 mt-1">
                        {format(parseISO(workout.date), 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm text-gray-400">训练时长</div>
                        <div className="text-lg font-semibold">{workout.duration}分钟</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">平均重量</div>
                        <div className="text-lg font-semibold">{getAvgWeight(workout)}kg</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-500" />
                      <span className="text-gray-400">
                        {workout.exercises.length}个动作 · {workout.exercises.length * 4}组
                      </span>
                    </div>
                    {getFailedSetsCount(workout) > 0 && (
                      <div className="flex items-center gap-2 text-yellow-500">
                        <AlertTriangle size={16} />
                        <span>{getFailedSetsCount(workout)}组未达标</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-gray-500" />
                      <span className="text-gray-400">
                        身体状态 {workout.notes.bodyCondition}/10
                      </span>
                    </div>
                  </div>

                  {selectedWorkout === workout.id && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="space-y-3">
                        {workout.exercises.map((exercise) => (
                          <div key={exercise.exerciseId}>
                            <div className="font-semibold text-white mb-2">
                              {exercise.exerciseName}
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-sm">
                              {exercise.sets.map((set) => (
                                <div
                                  key={set.setNumber}
                                  className={`
                                    bg-gray-900 rounded p-2 text-center
                                    ${set.actualReps < 12 || set.status === 'failure'
                                      ? 'border border-yellow-500'
                                      : ''
                                    }
                                  `}
                                >
                                  <div className="text-gray-400 mb-1">第{set.setNumber}组</div>
                                  <div className="font-semibold">{set.weight}kg</div>
                                  <div className="text-xs text-gray-500">
                                    {set.actualReps}次 · {set.restTime}s
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1">
                                    {SET_STATUS_NAMES[set.status]}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="text-sm text-gray-400 space-y-2">
                          {workout.notes.sleepQuality && (
                            <div>睡眠：{workout.notes.sleepQuality}</div>
                          )}
                          {workout.notes.feeling && (
                            <div>体感：{workout.notes.feeling}</div>
                          )}
                          {workout.notes.supplements && (
                            <div>补剂：{workout.notes.supplements}</div>
                          )}
                          {workout.notes.injury && (
                            <div className="text-red-400">伤病：{workout.notes.injury}</div>
                          )}
                          <div className="flex gap-4">
                            {workout.notes.warmup && <span>✓ 已热身</span>}
                            {workout.notes.stretching && <span>✓ 已拉伸</span>}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/workout/${workout.date}`)}
                        >
                          查看详情
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}