import { ITransition, State } from "@designcombo/types";
import cloneDeep from "lodash.clonedeep";
import { generateId } from "../utils/generate-id";

export function splitLayer(state: State, time: number): Partial<State> {
  const currentState = cloneDeep(state);

  // Only split if exactly one item is selected
  if (currentState.activeIds.length !== 1) return {};

  const id = currentState.activeIds[0];
  const trackItem = cloneDeep(currentState.trackItemsMap[id]);

  // Check if split position is valid
  if (time >= trackItem.display.to || time <= trackItem.display.from) {
    return {};
  }

  const newId = generateId();

  // Update original track item
  const updatedTrackItem = {
    ...trackItem,
    display: {
      from: trackItem.display.from,
      to: time
    }
  };

  // Create new track item
  const newTrackItem = {
    ...trackItem,
    id: newId,
    display: {
      from: time,
      to: trackItem.display.to
    }
  };

  const transitionFrom = Object.values(currentState.transitionsMap).find(
    (transt) => transt.fromId === trackItem.id && transt.kind !== "none"
  );

  const transitionTo = Object.values(currentState.transitionsMap).find(
    (transt) => transt.toId === trackItem.id && transt.kind !== "none"
  );

  // Handle trim values for video/audio content
  if (trackItem.type === "video" || trackItem.type === "audio") {
    const nextTrimToChange = time - updatedTrackItem.display.from;

    updatedTrackItem.trim = {
      from: trackItem.trim!.from,
      to: trackItem.trim!.from + nextTrimToChange
    };

    newTrackItem.trim = {
      from: trackItem.trim!.from + nextTrimToChange,
      to: trackItem.trim!.to
    };
  }

  if (transitionTo) {
    const durantion =
      updatedTrackItem.display.to - updatedTrackItem.display.from;
    if (transitionTo.duration / 2 > durantion) {
      currentState.transitionIds = currentState.transitionIds.filter(
        (id) => id !== transitionTo.id
      );
      const updateTransitionMap: Record<string, ITransition> = {};
      currentState.transitionIds.forEach(
        (id) => (updateTransitionMap[id] = currentState.transitionsMap[id])
      );
      currentState.transitionsMap = updateTransitionMap;
    }
  }

  if (transitionFrom) {
    const durantion = newTrackItem.display.to - newTrackItem.display.from;
    const updateTransitionMap: Record<string, ITransition> = {};
    if (transitionFrom.duration / 2 > durantion) {
      currentState.transitionIds = currentState.transitionIds.filter(
        (id) => id !== transitionFrom.id
      );
      currentState.transitionIds.forEach(
        (id) => (updateTransitionMap[id] = currentState.transitionsMap[id])
      );
      currentState.transitionsMap = updateTransitionMap;
    } else {
      currentState.transitionIds = currentState.transitionIds.map((id) => {
        const transition = currentState.transitionsMap[id];
        if (transition.fromId === updatedTrackItem.id) {
          return id.replace(updatedTrackItem.id, newId);
        } else return id;
      });
      Object.keys(currentState.transitionsMap).forEach((id) => {
        const transition = currentState.transitionsMap[id];
        if (transition.fromId === updatedTrackItem.id) {
          const replaceId = id.replace(updatedTrackItem.id, newId);
          updateTransitionMap[replaceId] = {
            ...currentState.transitionsMap[id],
            id: replaceId,
            fromId: newId
          };
        } else {
          updateTransitionMap[id] = currentState.transitionsMap[id];
        }
      });
      currentState.transitionsMap = updateTransitionMap;
    }
  }

  // Update state
  currentState.trackItemsMap[id] = updatedTrackItem;
  currentState.trackItemsMap[newId] = newTrackItem;
  currentState.trackItemIds.push(newId);

  // Add new item to appropriate track
  currentState.tracks.forEach((track) => {
    if (track.items.includes(id)) {
      track.items.push(newId);
    }
  });
  return {
    tracks: currentState.tracks,
    trackItemIds: currentState.trackItemIds,
    trackItemsMap: currentState.trackItemsMap,
    transitionsMap: currentState.transitionsMap,
    transitionIds: currentState.transitionIds
  };
}
