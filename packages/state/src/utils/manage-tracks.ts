import { State, ITrack, ITrackType } from "@designcombo/types";
import { nanoid } from "nanoid";
import { getAcceptsMap } from "../state-options";

interface TrackOptions {
  targetTrackIndex?: number;
  targetTrackId?: string;
  isNewTrack?: boolean;
}

interface TrackItem {
  id: string;
  type: string | ITrackType;
  details: any;
  [key: string]: any;
}

export function manageTracks(
  currentState: State,
  trackItems: TrackItem[],
  options: TrackOptions = {
    isNewTrack: true
  }
): State {
  const trackItemIds = trackItems.map((t) => t.id);
  const newTrackItemIds: string[] = [];
  const newTrackItemsMap: Record<string, any> = {};

  trackItems.forEach((trackItem) => {
    newTrackItemIds.push(trackItem.id);
    newTrackItemsMap[trackItem.id] = trackItem;
  });

  if (
    (options.targetTrackIndex !== undefined || options.targetTrackId) &&
    !options.isNewTrack
  ) {
    const targetTrackIndex = options.targetTrackIndex || 0;
    const targetTrackId = options.targetTrackId;

    let targetTrack: ITrack | undefined = currentState.tracks[targetTrackIndex];

    if (targetTrackId) {
      targetTrack = currentState.tracks.find((t) => t.id === targetTrackId);
    }

    if (!targetTrack) {
      throw new Error("Target track not found");
    }

    // add new item to target track
    targetTrack.items.push(...newTrackItemIds);
  } else {
    const newTrack: ITrack = {
      id: nanoid(),
      accepts: Object.keys(getAcceptsMap()),
      type: trackItems[0].type as ITrackType,
      items: trackItemIds,
      magnetic: false,
      static: false,
      muted: false
    };
    // add new track to current state
    currentState.tracks.splice(options.targetTrackIndex || 0, 0, newTrack);
  }

  currentState.trackItemsMap = {
    ...currentState.trackItemsMap,
    ...newTrackItemsMap
  };

  currentState.trackItemIds = [
    ...currentState.trackItemIds,
    ...newTrackItemIds
  ];
  return currentState;
}
