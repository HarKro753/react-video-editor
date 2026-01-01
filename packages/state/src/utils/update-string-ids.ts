import { ITrackItem, ItemStructure } from "@designcombo/types";
import { generateId } from "./generate-id";
import { loadFonts } from "./fonts";

export function updateStringIds(ids: string[], jsonString: string) {
  ids.forEach((id) => {
    jsonString = jsonString.split(id).join(generateId());
  });
  return jsonString;
}

export function findItemIdsTemplateComposition(
  structure: ItemStructure[],
  itemId: string,
  trackItemsMap: Record<string, ITrackItem>
) {
  const findStructure = structure.find((item) => item.id === itemId);
  if (!findStructure) return [];
  const itemIds = findStructure.items;
  itemIds.forEach((id) => {
    const item = trackItemsMap[id];
    if (item.type === "text" || item.type === "caption") {
      loadFonts([
        {
          fontFamily: item.details.fontFamily,
          url: item.details.fontUrl
        }
      ]);
    }
    if (item.type === "composition" || item.type === "template") {
      itemIds.push(
        ...findItemIdsTemplateComposition(structure, id, trackItemsMap)
      );
    }
  });
  return itemIds;
}
