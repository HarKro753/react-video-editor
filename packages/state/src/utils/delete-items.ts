import { ITrackItem, ItemStructure } from "@designcombo/types";

export function deleteItems(
  deleteItemIds: string[],
  availableItemIds: string[],
  trackItemsMap: Record<string, ITrackItem>,
  structure: ItemStructure[],
  updatedTrackItems: Record<string, ITrackItem>,
  updatedStructure: ItemStructure[]
) {
  availableItemIds.forEach((id) => {
    if (!deleteItemIds.includes(id)) {
      updatedTrackItems[id] = trackItemsMap[id];
      if (
        trackItemsMap[id].type === "composition" ||
        trackItemsMap[id].type === "template"
      ) {
        const findStructure = structure.find((item) => item.id === id);
        if (findStructure) {
          updatedStructure.push(findStructure);
          deleteItems(
            deleteItemIds,
            findStructure.items,
            trackItemsMap,
            structure,
            updatedTrackItems,
            updatedStructure
          );
        }
      }
    }
  });
  return { updatedTrackItems, updatedStructure };
}
