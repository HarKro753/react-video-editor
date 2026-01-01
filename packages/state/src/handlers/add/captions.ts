import { State, ICaption, ITrack } from "@designcombo/types";
import cloneDeep from "lodash.clonedeep";
import { loadCaptionItem, loadTracks } from "../../utils/load-item";
import { getDuration } from "../../utils/duration";
import { alignMagneticTracks } from "../../utils/align-tracks";
import { checkIfTrackExists } from "../../utils/load-item";

interface CaptionsPayload {
  trackItems: ICaption[];
  tracks: ITrack[];
}

interface CaptionsOptions {
  trackIndex?: number;
  trackId?: string;
  isNewTrack?: boolean;
  size?: { width: number; height: number };
}

export async function addCaptions(
  state: State,
  payload: CaptionsPayload,
  options: CaptionsOptions = {}
): Promise<Partial<State>> {
  const currentState = cloneDeep(state);

  const trackItemsPromise = payload.trackItems.map((trackItem) =>
    loadCaptionItem(trackItem, {
      size: options.size
    })
  );

  const trackItems = await Promise.all(trackItemsPromise);
  const newTracks = loadTracks(payload.tracks, payload.trackItems);

  const newTrackItemIds: string[] = [];
  const newTrackItemsMap: Record<string, any> = {};

  trackItems.forEach((trackItem) => {
    const { details, ...data } = trackItem;
    newTrackItemIds.push(trackItem.id);
    newTrackItemsMap[trackItem.id] = data;
  });

  const isAddtoExistingTrack = checkIfTrackExists(
    currentState.tracks,
    newTracks
  );

  if (isAddtoExistingTrack) {
    currentState.tracks.forEach((currentTrack) => {
      newTracks.forEach((newTrack) => {
        if (currentTrack.id === newTrack.id) {
          if (currentTrack.magnetic) {
            alignMagneticTracks(
              [currentTrack],
              currentState.trackItemsMap,
              newTrackItemIds
            );
          }
          currentTrack.items.push(...newTrackItemIds);
        }
      });
    });
  } else {
    const trackIndex = options.trackIndex || 0;
    const clampedTrackIndex = Math.min(
      Math.max(trackIndex, 0),
      currentState.tracks.length
    );
    currentState.tracks.splice(clampedTrackIndex, 0, ...newTracks);
  }

  currentState.trackItemsMap = {
    ...currentState.trackItemsMap,
    ...newTrackItemsMap
  };

  currentState.trackItemIds = [
    ...currentState.trackItemIds,
    ...newTrackItemIds
  ];

  currentState.duration = getDuration(currentState.trackItemsMap);

  const magneticTracks = currentState.tracks.filter((t) => t.magnetic);
  alignMagneticTracks(
    magneticTracks,
    currentState.trackItemsMap,
    newTrackItemIds
  );

  return {
    trackItemIds: currentState.trackItemIds,
    trackItemsMap: currentState.trackItemsMap,
    tracks: currentState.tracks,
    duration: currentState.duration
  };
}
