import { classRegistry } from "fabric";
import { ITrackItemAndDetails } from "@designcombo/types";
import { timeMsToUnits } from "./timeline";

export const loadObject = (
  item: ITrackItemAndDetails,
  options: { tScale: number; sizesMap: Record<string, number> }
) => {
  const display = item.display!;
  const left = timeMsToUnits(display.from, options.tScale);
  const width = timeMsToUnits(
    display.to - display.from,
    options.tScale,
    item.playbackRate
  );
  const height = options.sizesMap[item.type] || 42;

  // Convert type to PascalCase for class name
  const typeName = item.type.charAt(0).toUpperCase() + item.type.slice(1);
  const Klass = classRegistry.getClass(typeName) as any;

  const baseObject = {
    width,
    height,
    id: item.id,
    tScale: options.tScale,
    top: 10,
    left,
    display,
    duration: item.duration || display.to - display.from,
    metadata: item.metadata,
    playbackRate: item.playbackRate || 1,
    src: item.details?.src,
    trim: item.trim || { from: 0, to: item.duration! },
    text: item.details?.text,
    srcs: item.details?.srcs || [],
    backgroundColorDiv: item.details?.backgroundColor,
    svgString: item.details?.svgString
  };

  // Default case for all types
  return new Klass(baseObject);
};
