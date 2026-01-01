import { cloneDeep } from "lodash";
import {
  ITransition,
  State,
  ItemStructure,
  ITrackItem
} from "@designcombo/types";
import { removeItemsFromTrack } from "../utils/track";
import { getDuration } from "../utils/duration";
import { alignMagneticTracks } from "../utils/align-tracks";
import { deleteItems } from "../utils/delete-items";

export function deleteLayer(
  state: State,
  trackItemIds?: string[]
): Partial<State> {
  const currentState = cloneDeep(state);
  const targetActiveIds: string[] =
    trackItemIds && trackItemIds.length ? trackItemIds : currentState.activeIds;

  const itemsToDelete = targetActiveIds
    .map((id) => currentState.trackItemsMap[id])
    .filter((item) => !!item)
    .map((item) => item.id);

  // Find associated transition IDs that involve any of the items being deleted
  const transitionIdsToDelete = currentState.transitionIds.filter(
    (transitionId: string) => {
      const transition = currentState.transitionsMap[transitionId];
      return (
        itemsToDelete.includes(transition.fromId) ||
        itemsToDelete.includes(transition.toId)
      );
    }
  );

  // Add these transition IDs to the items to delete
  itemsToDelete.push(...transitionIdsToDelete);
  const desiredTransition: Record<string, ITransition> = {};

  const currentTrackItemIds = currentState.trackItemIds;
  const currentTransitionIds = currentState.transitionIds;
  const cloneTracks = cloneDeep(currentState.tracks);
  const currentStructure = cloneDeep(currentState.structure);

  itemsToDelete.forEach((id: string) => {
    const object =
      currentState.trackItemsMap[id] || currentState.transitionsMap[id];
    if (object.type === "template" || object.type === "composition") {
      const itemsIds = currentState.structure.find(
        (s: ItemStructure) => s.id === object.id
      )?.items!;
      itemsToDelete.push(...itemsIds);
      const findIndex = currentStructure.findIndex(
        (s: ItemStructure) => s.id === object.id
      );
      currentStructure.splice(findIndex, 1);
    }
  });

  itemsToDelete.forEach((id: string) => {
    currentStructure.forEach((s: ItemStructure) => {
      if (s.items.includes(id)) {
        s.items = s.items.filter((itemId: string) => itemId !== id);
      }
    });
  });

  const updatedTrackItemIds = currentTrackItemIds.filter(
    (id: string) => !itemsToDelete.includes(id)
  );

  currentTransitionIds.forEach((id: string) => {
    if (targetActiveIds.includes(id) && targetActiveIds.length === 1) {
      desiredTransition[id] = cloneDeep(currentState.transitionsMap[id]);
    }
  });

  const updatedTransitionIds = currentTransitionIds.filter(
    (id: string) => !itemsToDelete.includes(id) && !targetActiveIds.includes(id)
  );

  const updatedTransitionsMap = Object.fromEntries(
    Object.entries(currentState.transitionsMap).filter(
      ([id]) => !itemsToDelete.includes(id)
    )
  );
  Object.keys(updatedTransitionsMap).forEach((id: string) => {
    if (targetActiveIds.includes(id)) {
      updatedTransitionsMap[id].kind = "none";
    }
  });
  const filterIds = currentState.trackItemIds.filter(
    (id) => !targetActiveIds.includes(id)
  );
  const updatedTracks = removeItemsFromTrack(
    currentState.tracks,
    targetActiveIds
  );
  const updateTrackItemsMap = Object.fromEntries(
    Object.entries(currentState.trackItemsMap).filter(
      ([id]) => !itemsToDelete.includes(id)
    )
  );

  const magneticTracks = cloneTracks.filter((t) => t.magnetic);
  alignMagneticTracks(magneticTracks, updateTrackItemsMap, []);
  const validatedTrackItems: Record<string, ITrackItem> = {};
  const validatedStructure: ItemStructure[] = [];
  const { updatedTrackItems, updatedStructure } = deleteItems(
    itemsToDelete,
    filterIds,
    currentState.trackItemsMap,
    currentState.structure,
    validatedTrackItems,
    validatedStructure
  );
  const duration = getDuration(updatedTrackItems);

  return {
    trackItemIds: updatedTrackItemIds,
    activeIds: [],
    trackItemsMap: updatedTrackItems,
    tracks: updatedTracks,
    duration,
    structure: updatedStructure,
    transitionIds: updatedTransitionIds,
    transitionsMap: updatedTransitionsMap
  };
}
