import { State, IAudio } from "@designcombo/types";
import { cloneDeep } from "lodash";
import { loadAudioItem } from "../../utils/load-item";
import { getDuration } from "../../utils/duration";
import { alignMagneticTracks } from "../../utils/align-tracks";
import { manageTracks } from "../../utils/manage-tracks";

interface AddAudioOptions {
  targetTrackIndex?: number;
  targetTrackId?: string;
  isNewTrack?: boolean;
}

export async function addAudio(
  state: State,
  payload: IAudio,
  options: AddAudioOptions = {}
): Promise<Partial<State>> {
  const currentState = cloneDeep(state);

  const trackItemsPromise = [loadAudioItem(payload)];
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
