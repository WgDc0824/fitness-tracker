import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerProps {
  initialSeconds: number;
  onComplete?: () => void;
}

export function Timer({ initialSeconds, onComplete }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onComplete]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(initialSeconds);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="text-2xl font-bold text-white font-mono">
        {formatTime(seconds)}
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={isRunning ? 'secondary' : 'primary'}
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleReset}
        >
          <RotateCcw size={16} />
        </Button>
      </div>
    </div>
  );
}