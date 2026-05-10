interface StopwatchControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onLap: () => void;
  onReset: () => void;
}

export function StopwatchControls({
  isRunning,
  onStart,
  onStop,
  onLap,
  onReset,
}: StopwatchControlsProps) {
  return (
    <div className="flex gap-2 justify-center">
      {!isRunning ? (
        <button
          type="button"
          onClick={onStart}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-colors"
        >
          Start
        </button>
      ) : (
        <button
          type="button"
          onClick={onStop}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-colors"
        >
          Stop
        </button>
      )}

      <button
        type="button"
        onClick={onLap}
        disabled={!isRunning}
        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Lap
      </button>

      <button
        type="button"
        onClick={onReset}
        className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition-colors"
      >
        Reset
      </button>
    </div>
  );
}
