import type { TouchEvent } from "react";
import type { SwipeState } from "./types";
import { formatStopwatchTime } from "./formatStopwatchTime";
import { MergeArrowsIcon, TrashIcon } from "./icons";

interface StopwatchLapListProps {
  laps: number[];
  swipeState: SwipeState | null;
  onTouchStart: (e: TouchEvent, index: number) => void;
  onTouchMove: (e: TouchEvent, index: number) => void;
  onTouchEnd: (index: number) => void;
  onConfirmDelete: (index: number) => void;
  onOpenMerge: (index: number) => void;
}

export function StopwatchLapList({
  laps,
  swipeState,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onConfirmDelete,
  onOpenMerge,
}: StopwatchLapListProps) {
  if (laps.length === 0) return null;

  return (
    <div className="mt-4 max-h-64 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2 text-gray-700 flex items-center gap-2">
        Lap Times
        <span className="text-xs font-normal text-gray-500 flex items-center gap-1">
          <span className="md:hidden">clear ← Swipe → merge</span>
        </span>
      </h3>
      <div className="space-y-1">
        {laps.map((lap, index) => {
          const isSwipingThis = swipeState?.index === index;
          const swipeX = isSwipingThis ? swipeState.x : 0;
          const showDeleteHint = swipeX < -20;
          const showMergeHint = swipeX > 20;

          return (
            <div
              key={index}
              className="relative overflow-hidden rounded"
              onTouchStart={(e) => onTouchStart(e, index)}
              onTouchMove={(e) => onTouchMove(e, index)}
              onTouchEnd={() => onTouchEnd(index)}
            >
              {showDeleteHint && (
                <div className="absolute inset-0 bg-red-500 flex items-center justify-end px-4">
                  <TrashIcon className="h-6 w-6 text-white" />
                </div>
              )}
              {showMergeHint && (
                <div className="absolute inset-0 bg-blue-500 flex items-center justify-start px-4">
                  <MergeArrowsIcon className="h-6 w-6 text-white" />
                </div>
              )}

              <div
                className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors relative"
                style={{
                  transform: `translateX(${swipeX}px)`,
                  transition: isSwipingThis ? "none" : "transform 0.3s ease-out",
                }}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onConfirmDelete(index)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                    title="Delete lap"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                  <span className="text-sm font-medium text-gray-600">Lap {index + 1}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-semibold text-gray-800">
                    {formatStopwatchTime(lap)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenMerge(index)}
                    className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                    title="Merge lap"
                  >
                    <MergeArrowsIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
