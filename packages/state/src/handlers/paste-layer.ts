import {
  State,
  ITrack,
  ITrackItem,
  ITrackType,
  ItemStructure
} from "@designcombo/types";
import { generateId } from "../utils/generate-id";
import { cloneDeep } from "lodash";
import { loadFonts } from "../utils/fonts";
import { getDuration } from "../utils/duration";
import {
  findItemIdsTemplateComposition,
  updateStringIds
} from "../utils/update-string-ids";

export async function pasteLayer(state: State): Promise<Partial<State>> {
  let dataString = localStorage.getItem("DesignComboTemp");
  if (!dataString) return {};

  const currentState = cloneDeep(state);
  let data = cloneDeep(JSON.parse(dataString));
  const copyTrackItemIds: string[] = data.activeIds;
  const validateCopyTrackItemsMap: Record<string, ITrackItem> =
    data.trackItemsMap;
  const copyStructure: ItemStructure[] = data.structure;
  Object.keys(validateCopyTrackItemsMap).forEach((key) => {
    const item = validateCopyTrackItemsMap[key];
    if (item.type === "text" || item.type === "caption") {
      loadFonts([
        {
          fontFamily: item.details.fontFamily,
          url: item.details.fontUrl
        }
      ]);
    }
    if (item.type === "composition" || item.type === "template") {
      const itemIds = findItemIdsTemplateComposition(
        copyStructure,
        key,
        validateCopyTrackItemsMap
      );
      copyTrackItemIds.push(...itemIds);
    }
  });

  const validatedString = updateStringIds(copyTrackItemIds, dataString);
  const validatedData = cloneDeep(JSON.parse(validatedString));

  const newTracks: ITrack[] = currentState.tracks;

  validatedData.activeIds.forEach((id: string) => {
    const item = validatedData.trackItemsMap[id];
    currentState.trackItemsMap[id] = item;
    currentState.trackItemIds.push(id);
    const newTrack: ITrack = {
      id: generateId(),
      type: item.type as ITrackType,
      items: [id],
      magnetic: false,
      static: false,
      muted: false
    };
    newTracks.unshift(newTrack);
  });

  const newStructure = [...validatedData.structure, ...currentState.structure];
  const newTrackItemIds = currentState.trackItemIds;

  const newTrackItemsMap = {
    ...validatedData.trackItemsMap,
    ...currentState.trackItemsMap
  };

  const newState = {
    structure: newStructure,
    trackItemIds: newTrackItemIds,
    trackItemsMap: newTrackItemsMap,
    tracks: newTracks
  };

  const duration = getDuration(newState.trackItemsMap);

  return {
    trackItemIds: newState.trackItemIds,
    trackItemsMap: newState.trackItemsMap,
    structure: newState.structure,
    tracks: newState.tracks,
    duration: duration
  };
}
