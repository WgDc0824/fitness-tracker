import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { useWorkoutStore } from '@/store/workoutStore';
import { calculateStats } from '@/utils/statsCalculator';
import { DAY_TYPE_NAMES } from '@/types/training';
import { ArrowLeft, TrendingUp, Trophy, AlertTriangle, Calendar, Clock, BarChart2 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export function Stats() {
  const navigate = useNavigate();
  const { workoutHistory, loadHistory } = useWorkoutStore();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const stats = calculateStats(workoutHistory);

  const getProgressChartData = () => {
    const exerciseMap: Record<string, string> = {};
    workoutHistory.forEach(record => {
      record.exercises.forEach(exercise => {
        exerciseMap[exercise.exerciseId] = exercise.exerciseName;
      });
    });

    const chartData: { date: string; [key: string]: number | string }[] = [];
    
    stats.progressData.forEach(point => {
      const existingPoint = chartData.find(p => p.date === point.date);
      if (existingPoint) {
        existingPoint[exerciseMap[point.exerciseId] || point.exerciseId] = point.avgWeight;
      } else {
        chartData.push({
          date: point.date,
          [exerciseMap[point.exerciseId] || point.exerciseId]: point.avgWeight
        });
      }
    });

    return chartData.slice(-30).sort((a, b) => a.date.localeCompare(b.date));
  };

  const chartData = getProgressChartData();
  const exerciseNames = Object.keys(chartData[0] || {}).filter(k => k !== 'date');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <header className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft size={20} className="mr-2" />
            返回首页
          </Button>
          <h1 className="text-2xl font-bold mt-4">数据复盘</h1>
          <p className="text-gray-400 mt-1">训练统计与力量提升分析</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card variant="elevated">
            <CardContent className="text-center py-4">
              <Calendar size={32} className="mx-auto mb-2 text-orange-500" />
              <div className="text-3xl font-bold">{stats.totalWorkouts}</div>
              <div className="text-sm text-gray-400 mt-1">总训练次数</div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="text-center py-4">
              <TrendingUp size={32} className="mx-auto mb-2 text-green-500" />
              <div className="text-3xl font-bold">{stats.weeklyCompletion}%</div>
              <div className="text-sm text-gray-400 mt-1">本周完成率</div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="text-center py-4">
              <BarChart2 size={32} className="mx-auto mb-2 text-blue-500" />
              <div className="text-3xl font-bold">{stats.monthlyCompletion}%</div>
              <div className="text-sm text-gray-400 mt-1">本月完成率</div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="text-center py-4">
              <Trophy size={32} className="mx-auto mb-2 text-yellow-500" />
              <div className="text-3xl font-bold">{stats.personalBests.length}</div>
              <div className="text-sm text-gray-400 mt-1">个人最佳记录</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>
                <Trophy className="inline-block mr-2" size={20} />
                个人最佳记录 (PB)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.personalBests.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  暂无PB记录，开始训练吧！
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.personalBests.map((pb) => (
                    <div
                      key={pb.exerciseId}
                      className="flex items-center justify-between bg-gray-900 rounded-lg p-3"
                    >
                      <div>
                        <div className="font-semibold">{pb.exerciseName}</div>
                        <div className="text-sm text-gray-400">{pb.date}</div>
                      </div>
                      <div className="text-2xl font-bold text-yellow-500">
                        {pb.weight}kg
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>
                <AlertTriangle className="inline-block mr-2" size={20} />
                薄弱部位分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.weakAreas.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  表现优秀，暂无明显薄弱部位
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.weakAreas.map((area, index) => (
                    <div
                      key={area}
                      className="flex items-center gap-3 bg-gray-900 rounded-lg p-3"
                    >
                      <div className="text-lg font-semibold text-yellow-500">
                        #{index + 1}
                      </div>
                      <div className="font-semibold">{area}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>
              <TrendingUp className="inline-block mr-2" size={20} />
              力量提升趋势（近30天）
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                暂无训练数据，开始记录你的训练吧！
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    tick={{ fontSize: 12 }}
                    unit="kg"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  {exerciseNames.slice(0, 5).map((name, index) => (
                    <Line
                      key={name}
                      type="monotone"
                      dataKey={name}
                      stroke={[
                        '#ef4444',
                        '#3b82f6',
                        '#f59e0b',
                        '#8b5cf6',
                        '#10b981'
                      ][index]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <div className="mt-6">
          <Card>
            <CardContent>
              <div className="text-sm text-gray-400">
                <div className="font-semibold mb-2">训练建议：</div>
                <ul className="space-y-1">
                  {stats.weakAreas.length > 0 && (
                    <li>• 重点关注薄弱部位：{stats.weakAreas.join('、')}</li>
                  )}
                  {stats.weeklyCompletion < 80 && (
                    <li>• 本周训练完成率较低，建议保持训练频率</li>
                  )}
                  <li>• 继续保持每组12次的目标，循序渐进增加重量</li>
                  <li>• 注意休息恢复，避免过度训练</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}