import { ITrackItem } from "@designcombo/types";
import cloneDeep from "lodash.clonedeep";

export const getDimension = (
  item: ITrackItem,
  info: { width: number; height: number }
) => {
  const currentWidth = item.details.crop?.width || item.details.width || 0;
  const currentHeight = item.details.crop?.height || item.details.height || 0;
  let newMediaWidth = info.width;
  let newMediaHeight = info.height;
  const aspectRatio = info.width / info.height;
  if (currentWidth / currentHeight > aspectRatio) {
    newMediaWidth = currentWidth;
    newMediaHeight = currentWidth / aspectRatio;
  } else {
    newMediaHeight = currentHeight;
    newMediaWidth = currentHeight * aspectRatio;
  }
  return {
    newWidth: newMediaWidth,
    newHeight: newMediaHeight,
    crop: {
      x: 0,
      y: 0,
      height: currentHeight,
      width: currentWidth
    }
  };
};

export const getTimeDuration = (
  item: ITrackItem,
  info: { duration: number }
) => {
  const trim = cloneDeep(item.trim);
  const display = cloneDeep(item.display);
  if (info.duration < item.display.to) {
    display.to = info.duration + item.display.from;
    if (trim) trim.to = info.duration;
  }
  return {
    duration: info.duration,
    trim,
    display
  };
};
