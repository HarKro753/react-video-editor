import { ITrack, ITrackItem } from "@designcombo/types";
import { clamp } from "./math";

export const findTargetTrack = (
  trackItemIds: string[],
  tracks: ITrack[],
  trackItemsMap: Record<string, ITrackItem>,
  trackId?: string,
  trackIndex?: number
): { trackId: string | undefined; trackIndex: number | undefined } => {
  // Return false if both trackId and trackIndex are undefined
  if (trackId === undefined && trackIndex === undefined)
    return { trackId: undefined, trackIndex: undefined };

  // Get track using trackIndex (priority) or trackId
  const track =
    trackIndex !== undefined
      ? tracks[clamp(trackIndex, 0, tracks.length)]
      : tracks.find((track) => track.id === trackId);
  if (!track) {
    return {
      trackId: undefined,
      trackIndex:
        trackIndex !== undefined
          ? clamp(trackIndex, 0, tracks.length)
          : undefined
    };
  }

  const itemsInTrack = track.items.map((itemId) => trackItemsMap[itemId]);
  const newTrackItems = trackItemIds.map((id) => trackItemsMap[id]);

  // Check for overlapping items
  for (const item of itemsInTrack) {
    const itemFrom = item.display.from;
    const itemTo = item.display.to;

    for (const newItem of newTrackItems) {
      const newItemFrom = newItem.display.from;
      const newItemTo = newItem.display.to;

      // Check if items overlap
      if (!(newItemTo <= itemFrom || newItemFrom >= itemTo)) {
        return {
          trackId: undefined,
          trackIndex: tracks.indexOf(track)
        };
      }
    }
  }

  return {
    trackId: track.id,
    trackIndex: tracks.indexOf(track)
  };
};
