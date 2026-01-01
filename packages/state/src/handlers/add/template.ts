import { State, ITemplate, ITrackItem } from "@designcombo/types";
import cloneDeep from "lodash.clonedeep";
import { loadTemplateItem } from "../../utils/load-item";
import { getDuration } from "../../utils/duration";
import { alignMagneticTracks } from "../../utils/align-tracks";
import { manageTracks } from "../../utils/manage-tracks";

interface TemplateOptions {
  targetTrackIndex?: number;
  targetTrackId?: string;
  scaleMode?: string;
  scaleAspectRatio?: number;
}

export async function addTemplate(
  state: State,
  payload: ITemplate,
  options: TemplateOptions = {}
): Promise<Partial<State>> {
  const currentState = cloneDeep(state);
  const type = "template";
  const trackItemsMap = payload.trackItemsMap;
  const itemIds = payload.trackItemIds;
  const transitionsMap = payload.transitionsMap;
  const transitionsIds = payload.transitionIds || [];
  const tracks = payload.tracks || [];
  const structure = payload.structure || [];

  const { details, ...data } = await loadTemplateItem(payload, {
    size: currentState.size,
    scaleMode: options.scaleMode,
    scaleAspectRatio: options.scaleAspectRatio
  });

  const newItemStructure = {
    id: data.id,
    items: itemIds,
    transitions: transitionsIds,
    tracks
  };

  const trackItem = {
    ...data,
    type,
    details
  };

  const trackItems = [trackItem];

  // Use manageTracks for track management
  const updatedState = manageTracks(currentState, trackItems, options);

  updatedState.transitionIds = [
    ...updatedState.transitionIds,
    ...transitionsIds
  ];

  updatedState.transitionsMap = {
    ...updatedState.transitionsMap,
    ...transitionsMap
  };

  updatedState.trackItemsMap = {
    ...updatedState.trackItemsMap,
    ...trackItemsMap,
    [data.id]: {
      ...data,
      type,
      details
    }
  } as Record<string, ITrackItem>;

  updatedState.structure = [
    ...updatedState.structure,
    newItemStructure,
    ...structure
  ];

  updatedState.duration = getDuration(updatedState.trackItemsMap);

  const magneticTracks = updatedState.tracks.filter((t) => t.magnetic);

  alignMagneticTracks(magneticTracks, updatedState.trackItemsMap, [data.id]);

  return {
    trackItemIds: updatedState.trackItemIds,
    trackItemsMap: updatedState.trackItemsMap,
    tracks: updatedState.tracks,
    duration: updatedState.duration,
    structure: updatedState.structure,
    transitionsMap: updatedState.transitionsMap
  };
}
