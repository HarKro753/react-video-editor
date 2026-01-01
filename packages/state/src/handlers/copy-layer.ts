import { State, ITrack, ItemStructure } from "@designcombo/types";
import { cloneDeep } from "lodash";

export function copyLayer(state: State): void {
  const currentState = cloneDeep(state);
  if (!currentState.activeIds.length) return;

  const activeIds = currentState.activeIds;
  const cloneTracks: ITrack[] = [];
  const data = {
    activeIds,
    trackItemsMap: {} as Record<string, any>,
    tracks: [] as string[],
    structure: [] as ItemStructure[]
  };

  // Collect all items and their details
  activeIds.forEach((id) => {
    data.trackItemsMap[id] = currentState.trackItemsMap[id];
    cloneTracks.push(currentState.tracks.find((t) => t.items.includes(id))!);
  });

  // Remove duplicate tracks
  const validateClonedTracks = new Set<string>();
  cloneTracks.filter((item) => {
    if (validateClonedTracks.has(item.id)) {
      return false;
    } else {
      validateClonedTracks.add(item.id);
      return true;
    }
  });
  // Store track IDs
  data.tracks = Array.from(validateClonedTracks);
  data.activeIds.forEach((id) => {
    if (
      data.trackItemsMap[id].type === "composition" ||
      data.trackItemsMap[id].type === "template"
    ) {
      const findStructure = currentState.structure.find(
        (item) => item.id === id
      );
      if (findStructure) {
        data.structure.push(findStructure);
        findStructure.items.forEach((item) => {
          data.trackItemsMap[item] = currentState.trackItemsMap[item];
        });
      }
    }
  });
  const jsonStringfy = JSON.stringify(data);
  let newJsonStringfy = jsonStringfy;
  // Save to localStorage for later paste operation
  localStorage.setItem("DesignComboTemp", newJsonStringfy);
}
