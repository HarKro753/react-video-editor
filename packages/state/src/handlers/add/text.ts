import { State, IText } from "@designcombo/types";
import { cloneDeep } from "lodash";
import { loadTextItem } from "../../utils/load-item";
import { getDuration } from "../../utils/duration";
import { alignMagneticTracks } from "../../utils/align-tracks";
import { manageTracks } from "../../utils/manage-tracks";

interface TextOptions {
  targetTrackIndex?: number;
  targetTrackId?: string;
  isNewTrack?: boolean;
  size?: { width: number; height: number };
}

export async function addText(
  state: State,
  payload: Partial<IText>,
  options: TextOptions = {}
): Promise<Partial<State>> {
  const currentState = cloneDeep(state);

  const trackItemsPromise = [
    loadTextItem(payload as IText, {
      size: options.size
    })
  ];
  const trackItems = await Promise.all(trackItemsPromise);
  const newIds = trackItems.map((trackItem) => trackItem.id);
  const updatedState = manageTracks(currentState, trackItems, options);
  updatedState.duration = getDuration(updatedState.trackItemsMap);

  const magneticTracks = updatedState.tracks.filter((t) => t.magnetic);
  alignMagneticTracks(magneticTracks, updatedState.trackItemsMap, newIds);

  return {
    trackItemIds: updatedState.trackItemIds,
    trackItemsMap: updatedState.trackItemsMap,
    tracks: updatedState.tracks,
    duration: updatedState.duration
  };
}
