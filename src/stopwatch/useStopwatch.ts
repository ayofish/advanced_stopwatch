import { useCallback, useEffect, useRef, useState } from "react";
import type { TouchEvent } from "react";
import type { SwipeState, UseStopwatchOptions } from "./types";

export interface UseStopwatchResult {
  isRunning: boolean;
  time: number;
  laps: number[];
  lapToMerge: number | null;
  lapToDelete: number | null;
  swipeState: SwipeState | null;
  showOverride: boolean;
  overrideMinutes: string;
  overrideSeconds: string;
  overrideCentiseconds: string;
  setOverrideMinutes: (v: string) => void;
  setOverrideSeconds: (v: string) => void;
  setOverrideCentiseconds: (v: string) => void;
  handleStart: () => void;
  handleStop: () => void;
  handleReset: () => void;
  handleOverrideClick: () => void;
  handleApplyOverride: () => void;
  handleLap: () => void;
  confirmDeleteLap: (index: number) => void;
  handleDeleteLap: (index: number) => void;
  handleMergeLap: (index: number, direction: "previous" | "next") => void;
  handleTouchStart: (e: TouchEvent, index: number) => void;
  handleTouchMove: (e: TouchEvent, index: number) => void;
  handleTouchEnd: (index: number) => void;
  setShowOverride: (open: boolean) => void;
  setLapToDelete: (index: number | null) => void;
  setLapToMerge: (index: number | null) => void;
}

export function useStopwatch({
  onStart,
  onStop,
  onReset,
  onLap,
  onLapsChange,
  autoStart = false,
}: UseStopwatchOptions): UseStopwatchResult {
  const [isRunning, setIsRunning] = useState(autoStart);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const [lapToMerge, setLapToMerge] = useState<number | null>(null);
  const [lapToDelete, setLapToDelete] = useState<number | null>(null);
  const [swipeState, setSwipeState] = useState<SwipeState | null>(null);
  const [showOverride, setShowOverride] = useState(false);
  const [overrideMinutes, setOverrideMinutes] = useState("");
  const [overrideSeconds, setOverrideSeconds] = useState("");
  const [overrideCentiseconds, setOverrideCentiseconds] = useState("");

  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const touchStartXRef = useRef<number>(0);

  useEffect(() => {
    onLapsChange?.(laps);
  }, [laps, onLapsChange]);

  useEffect(() => {
    const updateTime = () => {
      if (startTimeRef.current) {
        const currentTime = performance.now() - startTimeRef.current;
        setTime(currentTime);
        animationFrameRef.current = requestAnimationFrame(updateTime);
      }
    };

    if (isRunning) {
      startTimeRef.current = performance.now() - time;
      animationFrameRef.current = requestAnimationFrame(updateTime);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, time]);

  const handleStart = useCallback(() => {
    setIsRunning(true);
    onStart?.();
  }, [onStart]);

  const handleStop = useCallback(() => {
    const sumOfLaps = laps.reduce((sum, lap) => sum + lap, 0);
    const finalLapTime = time - sumOfLaps;
    if (finalLapTime > 0) {
      setLaps((prev) => [...prev, finalLapTime]);
    }

    setIsRunning(false);
    onStop?.(time);
  }, [onStop, time, laps]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    setShowOverride(false);
    setOverrideMinutes("");
    setOverrideSeconds("");
    setOverrideCentiseconds("");
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    onReset?.();
  }, [onReset]);

  const handleOverrideClick = useCallback(() => {
    setShowOverride((prev) => !prev);
  }, []);

  const handleApplyOverride = useCallback(() => {
    const minutes = parseInt(overrideMinutes, 10) || 0;
    const seconds = parseInt(overrideSeconds, 10) || 0;
    const centiseconds = parseInt(overrideCentiseconds, 10) || 0;

    const totalMilliseconds =
      minutes * 60 * 1000 + seconds * 1000 + centiseconds * 10;

    setTime(totalMilliseconds);
    if (startTimeRef.current && isRunning) {
      startTimeRef.current = performance.now() - totalMilliseconds;
    }

    setShowOverride(false);
    setOverrideMinutes("");
    setOverrideSeconds("");
    setOverrideCentiseconds("");
  }, [overrideMinutes, overrideSeconds, overrideCentiseconds, isRunning]);

  const handleLap = useCallback(() => {
    const sumOfLaps = laps.reduce((sum, lap) => sum + lap, 0);
    const lapTime = time - sumOfLaps;
    setLaps((prev) => [...prev, lapTime]);
    onLap?.(lapTime, time);
  }, [time, laps, onLap]);

  const confirmDeleteLap = useCallback((index: number) => {
    setLapToDelete(index);
  }, []);

  const handleDeleteLap = useCallback(
    (index: number) => {
      const deletedLapTime = laps[index];

      setTime((currentTime) => {
        const newTime = currentTime - deletedLapTime;
        if (startTimeRef.current) {
          startTimeRef.current = performance.now() - newTime;
        }
        return newTime;
      });

      setLaps((prev) => {
        const newLaps = [...prev];
        newLaps.splice(index, 1);
        return newLaps;
      });

      setLapToDelete(null);
    },
    [laps],
  );

  const handleMergeLap = useCallback(
    (index: number, direction: "previous" | "next") => {
      setLaps((prev) => {
        const newLaps = [...prev];
        const currentLapTime = newLaps[index];

        if (direction === "previous" && index > 0) {
          newLaps[index - 1] += currentLapTime;
          newLaps.splice(index, 1);
        } else if (direction === "next" && index < newLaps.length - 1) {
          newLaps[index + 1] += currentLapTime;
          newLaps.splice(index, 1);
        }

        return newLaps;
      });
      setLapToMerge(null);
    },
    [],
  );

  const handleTouchStart = useCallback((e: TouchEvent, index: number) => {
    touchStartXRef.current = e.touches[0].clientX;
    setSwipeState({ index, x: 0 });
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent, index: number) => {
      if (swipeState?.index !== index) return;
      const deltaX = e.touches[0].clientX - touchStartXRef.current;
      setSwipeState({ index, x: deltaX });
    },
    [swipeState],
  );

  const handleTouchEnd = useCallback(
    (index: number) => {
      if (!swipeState || swipeState.index !== index) return;

      const threshold = 80;

      if (swipeState.x < -threshold) {
        confirmDeleteLap(index);
      } else if (swipeState.x > threshold) {
        setLapToMerge(index);
      }

      setSwipeState(null);
    },
    [swipeState, confirmDeleteLap],
  );

  return {
    isRunning,
    time,
    laps,
    lapToMerge,
    lapToDelete,
    swipeState,
    showOverride,
    overrideMinutes,
    overrideSeconds,
    overrideCentiseconds,
    setOverrideMinutes,
    setOverrideSeconds,
    setOverrideCentiseconds,
    handleStart,
    handleStop,
    handleReset,
    handleOverrideClick,
    handleApplyOverride,
    handleLap,
    confirmDeleteLap,
    handleDeleteLap,
    handleMergeLap,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    setShowOverride,
    setLapToDelete,
    setLapToMerge,
  };
}
