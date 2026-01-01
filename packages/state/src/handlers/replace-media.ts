import { State, ITrackItem } from "@designcombo/types";
import { cloneDeep } from "lodash";
import { getImageInfo, getVideoInfo } from "../utils/media";
import { alignMagneticTracks } from "../utils/align-tracks";
import { getDuration } from "../utils/duration";

export async function replaceMedia(
  state: State,
  data: Record<string, ITrackItem>
): Promise<Partial<State>> {
  const currentState = cloneDeep(state);
  const id = Object.keys(data)[0];
  const newData = Object.values(data)[0] as ITrackItem;
  const itemDetail = currentState.trackItemsMap[id];
  const details = itemDetail.details;

  if (!newData.details.src) return {};

  // Handle image replacement
  if (itemDetail.type === "image") {
    const imageInfo = await getImageInfo(newData.details.src);
    const currentDivWidth = itemDetail.details.width || 0;
    const currentDivHeight = itemDetail.details.height || 0;
    let newMediaWidth = imageInfo.width;
    let newMediaHeight = imageInfo.height;
    const aspectRatio = imageInfo.width / imageInfo.height;

    // Maintain aspect ratio while fitting within current dimensions
    if (currentDivWidth / currentDivHeight > aspectRatio) {
      newMediaWidth = currentDivWidth;
      newMediaHeight = currentDivWidth / aspectRatio;
    } else {
      newMediaHeight = currentDivHeight;
      newMediaWidth = currentDivHeight * aspectRatio;
    }

    details.crop = {
      x: 0,
      y: 0,
      height: details.height,
      width: details.width
    };
    newData.details.width = newMediaWidth;
    newData.details.height = newMediaHeight;
  }
  // Handle video replacement
  else if (itemDetail.type === "video") {
    const videoInfo = await getVideoInfo(newData.details.src);
    const currentDivWidth = itemDetail.details.width || 0;
    const currentDivHeight = itemDetail.details.height || 0;
    let newMediaWidth = videoInfo.width;
    let newMediaHeight = videoInfo.height;
    const aspectRatio = videoInfo.width / videoInfo.height;

    // Maintain aspect ratio while fitting within current dimensions
    if (currentDivWidth / currentDivHeight > aspectRatio) {
      newMediaWidth = currentDivWidth;
      newMediaHeight = currentDivWidth / aspectRatio;
    } else {
      newMediaHeight = currentDivHeight;
      newMediaWidth = currentDivHeight * aspectRatio;
    }

    details.crop = {
      x: 0,
      y: 0,
      height: details.height,
      width: details.width
    };
    newData.details.width = newMediaWidth;
    newData.details.height = newMediaHeight;

    // Update duration and trim
    itemDetail.duration = videoInfo.duration;
    itemDetail.trim = {
      from: 0,
      to: videoInfo.duration
    };

    // Calculate display duration considering playbackRate
    const playbackRate = itemDetail.playbackRate || 1;
    const displayDuration = videoInfo.duration / playbackRate;
    const newTo = itemDetail.display.from + displayDuration;

    itemDetail.display = {
      from: itemDetail.display.from,
      to:
        (itemDetail.duration || 0) >= videoInfo.duration
          ? itemDetail.display.to
          : newTo
    };
  }

  // Update item details
  if (newData.details) {
    itemDetail.details = { ...details, ...newData.details };
    newData.details = itemDetail.details;
  }

  // Update state
  currentState.trackItemsMap[id] = {
    ...currentState.trackItemsMap[id],
    type: newData.type
  } as ITrackItem;

  if (itemDetail.type === "video") {
    currentState.trackItemsMap[id].display = itemDetail.display;
    currentState.trackItemsMap[id].duration = itemDetail.duration;
    currentState.trackItemsMap[id].trim = itemDetail.trim;
  }

  // Find the track containing this item
  const findTrack = currentState.tracks.find((track) =>
    track.items.includes(id)
  );

  // Align magnetic tracks if the item is in a magnetic track and display changed
  if (findTrack && findTrack.magnetic && itemDetail.type === "video") {
    const magneticTracks = currentState.tracks.filter((t) => t.magnetic);
    // Realign all items in affected magnetic tracks
    // Pass empty array to realign all items from the beginning
    alignMagneticTracks(magneticTracks, currentState.trackItemsMap, []);
  }

  const duration = getDuration(currentState.trackItemsMap);

  return {
    trackItemsMap: {
      ...currentState.trackItemsMap
    },
    tracks: currentState.tracks,
    duration
  };
}
