export const formatTranscriptTimestamp = (
  startTimestampMs: unknown
): string | null => {
  if (
    typeof startTimestampMs !== "number" ||
    !Number.isFinite(startTimestampMs) ||
    startTimestampMs < 0
  ) {
    return null;
  }

  const totalSeconds = Math.floor(startTimestampMs / 1000);
  if (!Number.isSafeInteger(totalSeconds)) {
    return null;
  }

  const totalMinutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(totalMinutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};
