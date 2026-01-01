import { State, IImage } from "@designcombo/types";
import { cloneDeep } from "lodash";
import { loadImageItem } from "../../utils/load-item";
import { getDuration } from "../../utils/duration";
import { alignMagneticTracks } from "../../utils/align-tracks";
import { manageTracks } from "../../utils/manage-tracks";

interface AddImageOptions {
  targetTrackIndex?: number;
  targetTrackId?: string;
  scaleMode?: string;
  scaleAspectRatio?: number;
  isNewTrack?: boolean;
}

export async function addImage(
  state: State,
  payload: IImage,
  options: AddImageOptions = {}
): Promise<Partial<State>> {
  const currentState = cloneDeep(state);

  const trackItemsPromise = [
    loadImageItem(payload, {
      size: currentState.size,
      scaleMode: options.scaleMode,
      scaleAspectRatio: options.scaleAspectRatio
    })
  ];
  const trackItems = await Promise.all(trackItemsPromise);
  const newIds = trackItems.map((trackItem) => trackItem.id);

  const updatedState = manageTracks(currentState, trackItems, options);

  const magneticTracks = updatedState.tracks.filter((t) => t.magnetic);
  alignMagneticTracks(magneticTracks, updatedState.trackItemsMap, newIds);

  updatedState.duration = getDuration(updatedState.trackItemsMap);

  return {
    trackItemIds: updatedState.trackItemIds,
    trackItemsMap: updatedState.trackItemsMap,
    tracks: updatedState.tracks,
    duration: updatedState.duration
  };
}
