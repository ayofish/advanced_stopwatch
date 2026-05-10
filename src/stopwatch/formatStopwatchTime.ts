/** Formats milliseconds as `MM:SS:CS` (centiseconds). */
export function formatStopwatchTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((milliseconds % 1000) / 10);

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${centiseconds.toString().padStart(2, "0")}`;
}
