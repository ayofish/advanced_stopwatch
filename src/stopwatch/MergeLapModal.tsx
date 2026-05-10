import { formatStopwatchTime } from "./formatStopwatchTime";
import { MergeArrowsIcon } from "./icons";

interface MergeLapModalProps {
  laps: number[];
  lapIndex: number;
  onCancel: () => void;
  onMerge: (direction: "previous" | "next") => void;
}

export function MergeLapModal({
  laps,
  lapIndex,
  onCancel,
  onMerge,
}: MergeLapModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <MergeArrowsIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Merge Lap Time</h3>
            <p className="text-sm text-gray-500">
              Lap {lapIndex + 1} • {formatStopwatchTime(laps[lapIndex])}
            </p>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          This lap will be merged with an adjacent lap. Choose which direction:
        </p>

        <div className="space-y-3 mb-6">
          {lapIndex > 0 && (
            <button
              type="button"
              onClick={() => onMerge("previous")}
              className="w-full p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-left transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">
                    ← Merge with Lap {lapIndex}
                  </div>
                  <div className="text-sm text-gray-500">
                    New time: {formatStopwatchTime(laps[lapIndex - 1] + laps[lapIndex])}
                  </div>
                </div>
              </div>
            </button>
          )}

          {lapIndex < laps.length - 1 && (
            <button
              type="button"
              onClick={() => onMerge("next")}
              className="w-full p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-left transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">
                    Merge with Lap {lapIndex + 2} →
                  </div>
                  <div className="text-sm text-gray-500">
                    New time: {formatStopwatchTime(laps[lapIndex] + laps[lapIndex + 1])}
                  </div>
                </div>
              </div>
            </button>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
