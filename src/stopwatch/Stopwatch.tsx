import type { StopwatchProps } from "./types";
import { useStopwatch } from "./useStopwatch";
import { StopwatchControls } from "./StopwatchControls";
import { StopwatchDisplay } from "./StopwatchDisplay";
import { StopwatchLapList } from "./StopwatchLapList";
import { DeleteLapModal } from "./DeleteLapModal";
import { MergeLapModal } from "./MergeLapModal";

export function Stopwatch({
  onStart,
  onStop,
  onReset,
  onLap,
  onLapsChange,
  autoStart = false,
  showLaps = true,
  className = "",
}: StopwatchProps) {
  const sw = useStopwatch({
    onStart,
    onStop,
    onReset,
    onLap,
    onLapsChange,
    autoStart,
  });

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <StopwatchDisplay
        time={sw.time}
        laps={sw.laps}
        showOverride={sw.showOverride}
        overrideMinutes={sw.overrideMinutes}
        overrideSeconds={sw.overrideSeconds}
        overrideCentiseconds={sw.overrideCentiseconds}
        onToggleOverride={sw.handleOverrideClick}
        onApplyOverride={sw.handleApplyOverride}
        onCloseOverride={() => sw.setShowOverride(false)}
        onOverrideMinutesChange={sw.setOverrideMinutes}
        onOverrideSecondsChange={sw.setOverrideSeconds}
        onOverrideCentisecondsChange={sw.setOverrideCentiseconds}
      />

      <StopwatchControls
        isRunning={sw.isRunning}
        onStart={sw.handleStart}
        onStop={sw.handleStop}
        onLap={sw.handleLap}
        onReset={sw.handleReset}
      />

      {showLaps && (
        <StopwatchLapList
          laps={sw.laps}
          swipeState={sw.swipeState}
          onTouchStart={sw.handleTouchStart}
          onTouchMove={sw.handleTouchMove}
          onTouchEnd={sw.handleTouchEnd}
          onConfirmDelete={sw.confirmDeleteLap}
          onOpenMerge={sw.setLapToMerge}
        />
      )}

      {sw.lapToDelete !== null && (
        <DeleteLapModal
          lapIndex={sw.lapToDelete}
          lapDurationMs={sw.laps[sw.lapToDelete]}
          onCancel={() => sw.setLapToDelete(null)}
          onConfirm={() => sw.handleDeleteLap(sw.lapToDelete!)}
        />
      )}

      {sw.lapToMerge !== null && (
        <MergeLapModal
          laps={sw.laps}
          lapIndex={sw.lapToMerge}
          onCancel={() => sw.setLapToMerge(null)}
          onMerge={(direction) => sw.handleMergeLap(sw.lapToMerge!, direction)}
        />
      )}
    </div>
  );
}
