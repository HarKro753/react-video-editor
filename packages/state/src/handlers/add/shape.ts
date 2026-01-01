import { State, IShape } from "@designcombo/types";
import { cloneDeep } from "lodash";
import { loadShapeItem } from "../../utils/load-item";
import { getDuration } from "../../utils/duration";
import { alignMagneticTracks } from "../../utils/align-tracks";
import { manageTracks } from "../../utils/manage-tracks";

interface ShapeOptions {
  targetTrackIndex?: number;
  targetTrackId?: string;
  scaleMode?: string;
  scaleAspectRatio?: number;
}

export async function addShape(
  state: State,
  payload: IShape,
  options: ShapeOptions = {}
): Promise<Partial<State>> {
  const currentState = cloneDeep(state);

  const trackItemsPromise = [
    loadShapeItem(payload, {
      size: currentState.size,
      scaleMode: options.scaleMode,
      scaleAspectRatio: options.scaleAspectRatio
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
