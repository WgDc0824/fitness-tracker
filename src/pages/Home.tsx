import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { useWorkoutStore } from '@/store/workoutStore';
import { TRAINING_PLAN, getTrainingDayByDate } from '@/data/trainingPlan';
import { DAY_TYPE_NAMES, DAY_TYPE_COLORS, DayType } from '@/types/training';
import { Calendar, Dumbbell, BarChart2, Settings, TrendingUp, Clock } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();
  const { workoutHistory, loadHistory } = useWorkoutStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getDayTypeForDate = (date: Date): DayType => {
    const trainingDay = getTrainingDayByDate(date);
    return trainingDay ? trainingDay.type : 'rest';
  };

  const isWorkoutCompleted = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return workoutHistory.some(record => record.date === dateStr && record.completedAt);
  };

  const handleDayClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayType = getDayTypeForDate(date);
    
    if (dayType !== 'rest') {
      navigate(`/workout/${dateStr}`);
    }
  };

  const computeFirstDayOffset = (monthStartDate: Date): number => {
    const day = monthStartDate.getDay();
    return day === 0 ? 6 : day - 1;
  };

  const todayTraining = getTrainingDayByDate(new Date());
  const todayDateStr = format(new Date(), 'yyyy-MM-dd');
  const todayCompleted = workoutHistory.some(r => r.date === todayDateStr && r.completedAt);

  const completedThisWeek = workoutHistory.filter(r => {
    const recordDate = parseISO(r.date);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() - weekEnd.getDay() + 7);
    return recordDate >= weekStart && recordDate <= weekEnd && r.completedAt;
  }).length;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-2">健身打卡记录</h1>
          <p className="text-gray-400">无下肢五分化训练计划</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    <Calendar className="inline-block mr-2" size={20} />
                    训练日历
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={prevMonth}>
                      ←
                    </Button>
                    <span className="text-white font-semibold px-3">
                      {format(currentMonth, 'yyyy年MM月', { locale: zhCN })}
                    </span>
                    <Button size="sm" variant="ghost" onClick={nextMonth}>
                      →
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: computeFirstDayOffset(monthStart) }).map((_, i) => (
                    <div key={`empty-${i}`} className="p-2"></div>
                  ))}
                  {daysInMonth.map((day, index) => {
                    const dayType = getDayTypeForDate(day);
                    const completed = isWorkoutCompleted(day);
                    const isTodayDate = isToday(day);

                    return (
                      <div
                        key={index}
                        onClick={() => handleDayClick(day)}
                        className={`
                          relative p-2 rounded-lg text-center cursor-pointer transition-all duration-200
                          ${isTodayDate ? 'ring-2 ring-orange-500' : ''}
                          ${dayType === 'rest' ? 'bg-gray-800 text-gray-500' : 'hover:bg-gray-700'}
                          ${completed ? 'bg-green-900/30' : ''}
                        `}
                        style={{
                          backgroundColor: dayType !== 'rest' && !completed 
                            ? `${DAY_TYPE_COLORS[dayType]}20` 
                            : undefined
                        }}
                      >
                        <div className="text-sm font-semibold">
                          {format(day, 'd')}
                        </div>
                        {dayType !== 'rest' && (
                          <div 
                            className="text-xs mt-1 truncate"
                            style={{ color: DAY_TYPE_COLORS[dayType] }}
                          >
                            {DAY_TYPE_NAMES[dayType]}
                          </div>
                        )}
                        {completed && (
                          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>
                  <TrendingUp className="inline-block mr-2" size={20} />
                  本周进度
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Progress value={completedThisWeek} max={5} showLabel color="orange" />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-900 rounded-lg p-3">
                    <div className="text-gray-400 mb-1">已完成</div>
                    <div className="text-2xl font-bold text-orange-500">{completedThisWeek}</div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-3">
                    <div className="text-gray-400 mb-1">计划训练</div>
                    <div className="text-2xl font-bold text-white">5天</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>
                  <Dumbbell className="inline-block mr-2" size={20} />
                  今日训练
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todayTraining ? (
                  <div>
                    <div className="mb-3">
                      <div className="text-lg font-semibold" style={{ color: DAY_TYPE_COLORS[todayTraining.type] }}>
                        {todayTraining.name}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {todayTraining.exercises.length}个动作 · {todayTraining.exercises.length * 4}组
                      </div>
                    </div>
                    <Button
                      variant={todayCompleted ? 'secondary' : 'primary'}
                      size="lg"
                      className="w-full"
                      onClick={() => navigate(`/workout/${todayDateStr}`)}
                    >
                      {todayCompleted ? '查看记录' : '开始训练'}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-gray-400 mb-2">今天是休息日</div>
                    <div className="text-sm text-gray-500">好好恢复，明天继续</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="lg"
                className="h-16 flex flex-col items-center justify-center"
                onClick={() => navigate('/history')}
              >
                <Clock size={24} className="mb-1" />
                <span className="text-sm">历史记录</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-16 flex flex-col items-center justify-center"
                onClick={() => navigate('/stats')}
              >
                <BarChart2 size={24} className="mb-1" />
                <span className="text-sm">数据复盘</span>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="lg"
              className="w-full h-12 flex items-center justify-center gap-2"
              onClick={() => navigate('/settings')}
            >
              <Settings size={20} />
              设置
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <Card>
            <CardContent>
              <div className="text-sm text-gray-400">
                <div className="font-semibold mb-2">训练规则：</div>
                <ul className="space-y-1">
                  <li>• 每周5练，2天休息</li>
                  <li>• 每个动作4组×12次</li>
                  <li>• 力量动作组间休息60-90秒</li>
                  <li>• 核心动作组间休息45秒</li>
                  <li>• 全程无下肢训练</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}