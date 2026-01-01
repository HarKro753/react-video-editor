import { FRAME_INTERVAL, PREVIEW_FRAME_WIDTH } from "../constants/constants";
import { ITrackItem } from "@designcombo/types";

export function timeMsToUnits(
  timeMs: number,
  zoom = 1,
  playbackRate = 1
): number {
  const zoomedFrameWidth = PREVIEW_FRAME_WIDTH * zoom;
  const frames = timeMs * (60 / 1000);

  return (frames * zoomedFrameWidth) / playbackRate;
}

export function unitsToTimeMs(
  units: number,
  zoom = 1,
  playbackRate = 1
): number {
  const zoomedFrameWidth = PREVIEW_FRAME_WIDTH * zoom;

  const frames = units / zoomedFrameWidth;

  return frames * FRAME_INTERVAL * playbackRate;
}

export function calculateTimelineWidth(
  totalLengthMs: number,
  zoom = 1
): number {
  return timeMsToUnits(totalLengthMs, zoom);
}

export const getDuration = (trackItems: Record<string, ITrackItem>) =>
  Object.keys(trackItems).reduce((acc, id) => {
    const { display } = trackItems[id];
    return Math.max(acc, display.to);
  }, 0);
