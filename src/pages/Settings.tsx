import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { NumberInput } from '@/components/ui/Input';
import { useWorkoutStore } from '@/store/workoutStore';
import { TRAINING_PLAN, TRAINING_RULES } from '@/data/trainingPlan';
import { DAY_TYPE_NAMES, DAY_TYPE_COLORS } from '@/types/training';
import { ArrowLeft, Settings as SettingsIcon, Download, Trash2, AlertTriangle, Info, Bell, Moon } from 'lucide-react';

export function Settings() {
  const navigate = useNavigate();
  const { settings, updateSettings, clearAllData, exportData, workoutHistory } = useWorkoutStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearData = () => {
    if (showClearConfirm) {
      clearAllData();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
    }
  };

  const handleExport = () => {
    if (workoutHistory.length === 0) {
      alert('暂无训练数据可导出');
      return;
    }
    exportData();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <header className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft size={20} className="mr-2" />
            返回首页
          </Button>
          <h1 className="text-2xl font-bold mt-4">设置</h1>
        </header>

        <div className="space-y-4">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>
                <SettingsIcon className="inline-block mr-2" size={20} />
                训练设置
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <NumberInput
                  label="默认组间休息时长（秒）"
                  value={settings.restTime}
                  onChange={(value) => updateSettings({ restTime: value })}
                  min={30}
                  max={180}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell size={20} className="text-gray-400" />
                    <span>训练提醒</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableNotifications}
                    onChange={(e) => updateSettings({ enableNotifications: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-orange-500 focus:ring-orange-500"
                  />
                </div>

                {settings.enableNotifications && (
                  <input
                    type="time"
                    value={settings.notificationTime || '18:00'}
                    onChange={(e) => updateSettings({ notificationTime: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white focus:border-orange-500 focus:outline-none"
                  />
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon size={20} className="text-gray-400" />
                    <span>深色主题</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.theme === 'dark'}
                    onChange={(e) => updateSettings({ theme: e.target.checked ? 'dark' : 'light' })}
                    className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>
                <Download className="inline-block mr-2" size={20} />
                数据管理
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">训练记录数量</div>
                    <div className="text-sm text-gray-400">
                      {workoutHistory.length}条记录
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleExport}
                    disabled={workoutHistory.length === 0}
                  >
                    <Download size={16} className="mr-2" />
                    导出Excel
                  </Button>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-red-400">清空所有数据</div>
                      <div className="text-sm text-gray-400">
                        删除所有训练记录和设置
                      </div>
                    </div>
                    <Button
                      variant={showClearConfirm ? 'primary' : 'outline'}
                      size="md"
                      onClick={handleClearData}
                      className={showClearConfirm ? 'bg-red-500 hover:bg-red-600' : ''}
                    >
                      {showClearConfirm ? (
                        <>
                          <AlertTriangle size={16} className="mr-2" />
                          确认清空
                        </>
                      ) : (
                        <>
                          <Trash2 size={16} className="mr-2" />
                          清空数据
                        </>
                      )}
                    </Button>
                  </div>
                  {showClearConfirm && (
                    <div className="mt-2 text-sm text-red-400">
                      点击确认后将永久删除所有数据，无法恢复！
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>
                <Info className="inline-block mr-2" size={20} />
                训练计划说明
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-gray-400">
                  <div className="font-semibold mb-2">训练规则：</div>
                  <ul className="space-y-1">
                    <li>• 标准频次：每周{TRAINING_RULES.weeklyFrequency}练，{TRAINING_RULES.restDays}天休息</li>
                    <li>• 标准组数：每个动作{TRAINING_RULES.standardSets}组</li>
                    <li>• 标准次数：每组{TRAINING_RULES.standardReps}次</li>
                    <li>• 力量动作组间休息：{TRAINING_RULES.strengthRestTime}</li>
                    <li>• 核心动作组间休息：{TRAINING_RULES.coreRestTime}</li>
                    <li>• 标准目标：{TRAINING_RULES.goal}</li>
                    <li>• 硬性规则：{TRAINING_RULES.rule}</li>
                  </ul>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="font-semibold mb-3">五分化训练计划：</div>
                  <div className="space-y-2">
                    {TRAINING_PLAN.map((day) => (
                      <div key={day.day} className="bg-gray-900 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold" style={{ color: DAY_TYPE_COLORS[day.type] }}>
                            Day{day.day} · {day.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {day.exercises.length}个动作
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          {day.exercises.map(e => e.name).join('、')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="text-center text-sm text-gray-400">
                <div className="mb-2">无下肢五分化健身打卡记录</div>
                <div>版本 V1.0</div>
                <div className="mt-2">数据存储于本地浏览器，关闭网页数据不丢失</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}