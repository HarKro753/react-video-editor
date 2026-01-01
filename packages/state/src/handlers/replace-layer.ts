import { State, ITrackItem } from "@designcombo/types";
import { getImageInfo, getVideoInfo, getAudioInfo } from "../utils/media";
import { getDimension } from "../utils/replace-item";
import { getTimeDuration } from "../utils/replace-item";

export async function replaceLayer(
  state: State,
  data: Record<string, ITrackItem>
): Promise<Partial<State>> {
  const currentState = { ...state };
  const id = Object.keys(data)[0];
  const newData = Object.values(data)[0] as ITrackItem;
  const itemDetail = currentState.trackItemsMap[id];
  const newItemData = { ...currentState.trackItemsMap[id] };
  const details = itemDetail.details;

  if (!newData.details.src) return {};

  if (itemDetail.type === "image") {
    const imageInfo = await getImageInfo(newData.details.src);
    const { crop, newHeight, newWidth } = getDimension(itemDetail, imageInfo);
    newData.details.crop = crop;
    newData.details.height = newHeight;
    newData.details.width = newWidth;
  } else if (itemDetail.type === "video") {
    const videoInfo = await getVideoInfo(newData.details.src);
    const item = currentState.trackItemsMap[id];
    const { display, duration, trim } = getTimeDuration(item, videoInfo);
    const { crop, newHeight, newWidth } = getDimension(itemDetail, videoInfo);
    newData.details.crop = crop;
    newData.details.height = newHeight;
    newData.details.width = newWidth;
    newItemData.display = display;
    newItemData.duration = duration;
    newItemData.trim = trim;
  } else if (itemDetail.type === "audio") {
    const audioData = await getAudioInfo(newData.details.src);
    const item = currentState.trackItemsMap[id];
    const { display, duration, trim } = getTimeDuration(item, audioData);
    newItemData.display = display;
    newItemData.duration = duration;
    newItemData.trim = trim;
  }

  if (itemDetail.metadata && newData.metadata) {
    newItemData.metadata = { ...itemDetail.metadata, ...newData.metadata };
  } else if (newData.metadata) {
    newItemData.metadata = newData.metadata;
  }
  itemDetail.details = { ...details, ...newData.details };
  currentState.trackItemsMap[id] = { ...newItemData };

  return {
    trackItemsMap: {
      ...currentState.trackItemsMap,
      [id]: { ...newItemData, details: { ...details, ...newData.details } }
    }
  };
}
