import { State, ITrack, ITrackItem } from "@designcombo/types";
import cloneDeep from "lodash.clonedeep";
import { loadTrackItem, loadTracks } from "../../utils/load-item";
import { getDuration } from "../../utils/duration";
import { alignMagneticTracks } from "../../utils/align-tracks";
import { checkIfTrackExists } from "../../utils/load-item";
import { validateDisplay } from "../../utils/validate-display";

interface StructureItem {
  id: string;
  items: string[];
  transitions: string[];
  tracks: ITrack[];
}

interface ItemsPayload {
  trackItems: any[];
  tracks: ITrack[];
}

interface ItemsOptions {
  trackIndex?: number;
}

export async function addItems(
  state: State,
  payload: ItemsPayload,
  options: ItemsOptions = {}
): Promise<Partial<State>> {
  const currentState = cloneDeep(state);

  const trackItemsPromise = payload.trackItems.map((trackItem) =>
    loadTrackItem(trackItem, {
      size: currentState.size
    })
  );

  const trackItems = (await Promise.all(trackItemsPromise)) as ITrackItem[];
  payload.tracks?.forEach((track) => {
    validateDisplay(
      trackItems,
      { idTrack: track.id, idItems: track.items },
      currentState
    );
  });
  const newTracks = loadTracks(payload.tracks, payload.trackItems);
  const newStructure: StructureItem[] = [];
  const newIds = trackItems.map((trackItem) => trackItem.id);

  payload.trackItems.forEach((item) => {
    if (item.type !== "template") return;
    currentState.trackItemsMap = {
      ...currentState.trackItemsMap,
      ...item.trackItemsMap
    };
    currentState.transitionsMap = {
      ...currentState.transitionsMap,
      ...item.transitionsMap
    };
    const newStructureItem: StructureItem = {
      id: item.id,
      items: item.trackItemIds,
      transitions: item.transitionsIds || [],
      tracks: item.tracks
    };
    newStructure.push(newStructureItem);
  });

  const newTrackItemIds: string[] = [];
  const newTrackItemsMap: Record<string, ITrackItem> = {};

  trackItems.forEach((trackItem) => {
    newTrackItemIds.push(trackItem.id);
    newTrackItemsMap[trackItem.id] = trackItem;
  });

  const validateNewTracks = newTracks.map((newTrack) => {
    if (checkIfTrackExists(currentState.tracks, [newTrack])) {
      return newTrack;
    }
    return null;
  });

  validateNewTracks.forEach((newTrack, index) => {
    if (newTrack) {
      currentState.tracks.forEach((currentTrack) => {
        if (currentTrack.id === newTrack.id) {
          currentTrack.items = currentTrack.items.concat(newTrack.items);
          if (currentTrack.magnetic) {
            alignMagneticTracks(
              [currentTrack],
              currentState.trackItemsMap,
              newIds
            );
          }
        }
      });
    } else {
      const trackIndex = options.trackIndex || 0;
      const newTrack = newTracks[index];
      const clampedTrackIndex = Math.min(
        Math.max(trackIndex, 0),
        currentState.tracks.length
      );
      currentState.tracks.splice(clampedTrackIndex, 0, newTrack);
    }
  });

  currentState.trackItemsMap = {
    ...currentState.trackItemsMap,
    ...newTrackItemsMap
  };

  currentState.trackItemIds = [
    ...currentState.trackItemIds,
    ...newTrackItemIds
  ];

  currentState.structure = [...currentState.structure, ...newStructure];

  currentState.duration = getDuration(currentState.trackItemsMap);

  return {
    trackItemIds: currentState.trackItemIds,
    trackItemsMap: currentState.trackItemsMap,
    tracks: currentState.tracks,
    duration: currentState.duration,
    structure: currentState.structure,
    transitionIds: currentState.transitionIds,
    transitionsMap: currentState.transitionsMap
  };
}
