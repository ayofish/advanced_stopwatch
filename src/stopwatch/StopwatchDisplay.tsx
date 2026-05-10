import { formatStopwatchTime } from "./formatStopwatchTime";

interface StopwatchDisplayProps {
  time: number;
  laps: number[];
  showOverride: boolean;
  overrideMinutes: string;
  overrideSeconds: string;
  overrideCentiseconds: string;
  onToggleOverride: () => void;
  onApplyOverride: () => void;
  onCloseOverride: () => void;
  onOverrideMinutesChange: (value: string) => void;
  onOverrideSecondsChange: (value: string) => void;
  onOverrideCentisecondsChange: (value: string) => void;
}

export function StopwatchDisplay({
  time,
  laps,
  showOverride,
  overrideMinutes,
  overrideSeconds,
  overrideCentiseconds,
  onToggleOverride,
  onApplyOverride,
  onCloseOverride,
  onOverrideMinutesChange,
  onOverrideSecondsChange,
  onOverrideCentisecondsChange,
}: StopwatchDisplayProps) {
  const currentSplit = time - laps.reduce((sum, lap) => sum + lap, 0);

  return (
    <div className="text-center">
      <div className="flex flex-row justify-center items-center gap-2">
        <div className="text-2xl font-mono font-semibold text-gray-500 mb-2">
          {formatStopwatchTime(time)}
        </div>
        <div className="text-xs font-mono font-semibold text-gray-500 mb-2">
          <button
            type="button"
            onClick={onToggleOverride}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            override
          </button>
        </div>
      </div>

      {showOverride && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Override Time</div>
          <div className="flex justify-center items-center gap-2">
            <input
              type="number"
              min={0}
              placeholder="MM"
              value={overrideMinutes}
              onChange={(e) => onOverrideMinutesChange(e.target.value)}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center font-mono"
            />
            <span className="font-bold text-gray-600">:</span>
            <input
              type="number"
              min={0}
              max={59}
              placeholder="SS"
              value={overrideSeconds}
              onChange={(e) => onOverrideSecondsChange(e.target.value)}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center font-mono"
            />
            <span className="font-bold text-gray-600">:</span>
            <input
              type="number"
              min={0}
              max={99}
              placeholder="CS"
              value={overrideCentiseconds}
              onChange={(e) => onOverrideCentisecondsChange(e.target.value)}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center font-mono"
            />
          </div>
          <div className="flex gap-2 justify-center mt-3">
            <button
              type="button"
              onClick={onCloseOverride}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onApplyOverride}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
      <div className="text-sm text-gray-400 mb-3">Total Elapsed Time</div>
      <div className="text-6xl font-mono font-bold text-gray-800 tabular-nums">
        {formatStopwatchTime(currentSplit)}
      </div>
      <div className="text-sm text-gray-500 mt-1">Current Split</div>
      <div className="text-xs text-gray-400 mt-0.5">MM:SS:CS (1/100s)</div>
    </div>
  );
}
