import { cloneDeep } from "lodash";
import { State, ITrack } from "@designcombo/types";
import { generateId } from "../utils/generate-id";

export function duplicateLayer(
  state: State,
  trackItemIds?: string[]
): Partial<State> {
  const currentState = cloneDeep(state);
  const trackToCloneMap: Record<string, ITrack> = {};

  const targetItemIds: string[] =
    trackItemIds && trackItemIds.length ? trackItemIds : currentState.activeIds;

  if (targetItemIds.length === 0) return {};

  // Clone each item and its details
  targetItemIds.forEach((id) => {
    const trackItem = currentState.trackItemsMap[id];
    const newId = generateId();

    // Clone the track item and its details
    currentState.trackItemsMap[newId] = {
      ...cloneDeep(trackItem),
      id: newId
    };

    currentState.trackItemIds.push(newId);

    // Find and clone the associated track
    const track = currentState.tracks.find((track) =>
      track.items.includes(id)
    )!;

    if (trackToCloneMap[track.id]) {
      trackToCloneMap[track.id].items.push(newId);
    } else {
      trackToCloneMap[track.id] = {
        ...track,
        id: generateId(),
        items: [newId],
        static: false,
        magnetic: false
      };
    }
  });

  // Add new tracks to the beginning of the tracks array
  const newTracks: ITrack[] = Object.values(trackToCloneMap);
  currentState.tracks = [...newTracks, ...currentState.tracks];

  return {
    trackItemsMap: currentState.trackItemsMap,
    tracks: currentState.tracks,
    trackItemIds: currentState.trackItemIds
  };
}
