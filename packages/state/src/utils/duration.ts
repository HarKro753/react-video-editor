import { ITrackItem } from "@designcombo/types";

export const getDuration = (trackItems: Record<string, ITrackItem>) =>
  Object.keys(trackItems).reduce((acc, id) => {
    const { display } = trackItems[id];
    return Math.max(acc, display.to);
  }, 0);
