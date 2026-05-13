export interface StopwatchProps {
  onStart?: () => void;
  onStop?: (time: number) => void;
  onReset?: () => void;
  onLap?: (lapTime: number, totalTime: number) => void;
  onLapsChange?: (laps: number[]) => void;
  autoStart?: boolean;
  showLaps?: boolean;
  className?: string;
}

export type UseStopwatchOptions = Omit<StopwatchProps, "className" | "showLaps">;

export interface SwipeState {
  index: number;
  x: number;
}
