// @vendors
import { Progress, ProgressProps } from 'antd';
import { useState, useEffect, useRef, FC } from 'react';

interface FakeProgressBarProps extends ProgressProps {
  ariaLabel: string;
  handleTimeout: Function;
  maxProgress: number;
  progressTime: number;
  timeoutLimit: number;
}

export const FakeProgressBar: FC<FakeProgressBarProps> = ({
  ariaLabel = 'progress',
  handleTimeout = () => {},
  maxProgress = 100,
  progressTime = 60,
  timeoutLimit = 60,
  ...props
}) => {
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<any>();
  const timeoutRef = useRef<any>();

  const onTimeout = () => {
    setProgress(0);
    handleTimeout();
  };

  const startTimeout = () => {
    timeoutRef.current = setTimeout(onTimeout, timeoutLimit * 1000);
  };

  const step = (startTime: number, endTime: number) => {
    const currentTime = new Date().getTime();

    if (currentTime > endTime) {
      setProgress(maxProgress);
      startTimeout();
      return cancelAnimationFrame(animationRef.current);
    }

    const progress = ((currentTime - startTime) / (endTime - startTime)) * maxProgress;

    setProgress(progress);

    animationRef.current = window.requestAnimationFrame(() => step(startTime, endTime));
  };

  useEffect(() => {
    // Get current time at mounting
    const currentTime = new Date().getTime();

    // Add 90 seconds
    const endTime = currentTime + progressTime * 1000;

    animationRef.current = window.requestAnimationFrame(() => step(currentTime, endTime));
    return () => {
      cancelAnimationFrame(animationRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Progress
      {...props}
      percent={Number(progress)}
      aria-label={ariaLabel}
      showInfo={false}
      status='active'
    />
  );
};
