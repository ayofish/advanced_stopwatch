import { formatStopwatchTime } from "./formatStopwatchTime";
import { WarningTriangleIcon } from "./icons";

interface DeleteLapModalProps {
  lapIndex: number;
  lapDurationMs: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteLapModal({
  lapIndex,
  lapDurationMs,
  onCancel,
  onConfirm,
}: DeleteLapModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <WarningTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Lap Time</h3>
            <p className="text-sm text-gray-500">
              Lap {lapIndex + 1} • {formatStopwatchTime(lapDurationMs)}
            </p>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this lap time? This action cannot be undone.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow-md transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
