import { State, IComposition, ITrackItem } from "@designcombo/types";
import { cloneDeep } from "lodash";
import { loadCompositionItem } from "../../utils/load-item";
import { getDuration } from "../../utils/duration";
import { alignMagneticTracks } from "../../utils/align-tracks";
import { manageTracks } from "../../utils/manage-tracks";

interface CompositionOptions {
  targetTrackIndex?: number;
  targetTrackId?: string;
  scaleMode?: string;
  scaleAspectRatio?: number;
}

export async function addComposition(
  state: State,
  payload: IComposition | any,
  options: CompositionOptions = {}
): Promise<Partial<State>> {
  const currentState = cloneDeep(state);
  const type = "composition";
  const trackItemsMap = payload.trackItemsMap;
  const itemIds = payload.trackItemIds;
  const tracks = payload.tracks || [];
  const trackItemDetailsMap = payload.trackItemDetailsMap;

  const { details, ...data } = await loadCompositionItem(payload, {
    size: currentState.size,
    scaleMode: options.scaleMode,
    scaleAspectRatio: options.scaleAspectRatio
  });

  const newItemStructure = {
    id: data.id,
    items: itemIds,
    transitions: [],
    tracks
  };

  // Create a track item that matches the interface expected by manageTracks
  const trackItem = {
    ...data,
    type,
    details
  };

  const trackItems = [trackItem];

  // Use manageTracks for track management
  const updatedState = manageTracks(currentState, trackItems, options);

  updatedState.trackItemsMap = {
    ...updatedState.trackItemsMap,
    ...trackItemsMap,
    [data.id]: {
      ...data,
      type,
      details
    }
  } as Record<string, ITrackItem>;

  updatedState.structure = [...updatedState.structure, newItemStructure];

  updatedState.duration = getDuration(updatedState.trackItemsMap);

  const magneticTracks = updatedState.tracks.filter((t) => t.magnetic);

  alignMagneticTracks(magneticTracks, updatedState.trackItemsMap, [data.id]);

  if (trackItemDetailsMap) {
    Object.keys(trackItemDetailsMap).forEach((key) => {
      updatedState.trackItemsMap[key] = {
        ...updatedState.trackItemsMap[key],
        details: {
          ...trackItemDetailsMap[key].details
        }
      };
    });
  }

  return {
    trackItemIds: updatedState.trackItemIds,
    trackItemsMap: updatedState.trackItemsMap,
    tracks: updatedState.tracks,
    duration: updatedState.duration,
    structure: updatedState.structure
  };
}
