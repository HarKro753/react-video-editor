import {
  IAudio,
  IBoxShadow,
  ICaption,
  IComposition,
  IDisplay,
  IIllustration,
  IImage,
  ILinealAudioBars,
  IProgressBar,
  IProgressFrame,
  IProgressSquare,
  IRadialAudioBars,
  IRect,
  IShape,
  ISize,
  ITemplate,
  IText,
  ITextDetails,
  ITrack,
  ITrackItem,
  ITrim,
  IVideo,
  IVideoDetails
} from "@designcombo/types";
import {
  getAudioInfo,
  getImageInfo,
  getTextInfo,
  getIVideotemInfo
} from "./media";
import { loadFonts } from "./fonts";
import { generateId } from "./generate-id";
import { convertSvgColorsToHex, prefixSvgClasses } from "./load-illustration";
import cloneDeep from "lodash.clonedeep";

const defaultShadow: IBoxShadow = {
  color: "#000000",
  x: 0,
  y: 0,
  blur: 0
};

const getDisplay = (
  display?: IDisplay,
  options?: { duration: number; trim?: ITrim }
) => {
  let defaultDuration = options?.trim
    ? options.trim.to - options.trim.from
    : options?.duration || 5000;

  // Default range
  const defaultDisplay = {
    from: 0,
    to: defaultDuration
  };

  // If no display object is provided, return the default range
  if (!display) {
    return defaultDisplay;
  }

  // Validation: 'from' should be a non-negative number
  if (display.from < 0) {
    console.error(
      "'from' must be a non-negative number. Returning default display."
    );
    return defaultDisplay;
  }

  // If 'from' is provided (including if it's 0) and 'to' is not, calculate 'to' based on duration
  if (display.from !== undefined && display.to === undefined) {
    return {
      from: display.from,
      to: display.from + defaultDuration
    };
  }

  // Validation: 'to' should be a non-negative number and greater than or equal to 'from'
  if (display.to !== undefined) {
    if (display.to < 0) {
      console.error(
        "'to' must be a non-negative number. Returning default display."
      );
      return defaultDisplay;
    }
    if (display.to < display.from) {
      console.error(
        "'to' must be greater than or equal to 'from'. Returning default display."
      );
      return defaultDisplay;
    }
  }

  return display;
};

const getTrim = (trim: ITrim, options: { duration: number }) => {
  if (!trim)
    return {
      from: 0,
      to: options.duration
    };
  if (trim.from && !trim.to) {
    return {
      from: trim.from,
      to: options.duration
    };
  }
  return trim;
};

// Define a type for the options
type OptionsType = {
  size: {
    width: number;
    height: number;
  };
  origin: number;
  scaleMode?: string;
  scaleAspectRatio?: number;
};

// Define a type for the image info
type TargetSize = {
  width: number;
  height: number;
};
export function getTextPosition(
  options: Partial<OptionsType>,
  info: TargetSize
): { top: string; left: string; transform: string } {
  // Calculate the center of the scene
  const sceneCenter = {
    x: options.size!.width / 2,
    y: options.size!.height / 2
  };

  // Calculate the center of the text/caption
  const textCenter = { x: info.width / 2, y: info.height / 2 };

  // Calculate the position to center the text/caption
  const left = sceneCenter.x - textCenter.x;
  const top = sceneCenter.y - textCenter.y;

  return {
    top: `${top}px`,
    left: `${left}px`,
    transform: "none" // No scaling for text/captions
  };
}

function getInitialPosition(
  options: Partial<OptionsType>,
  info: TargetSize
): { top: string; left: string; transform: string } {
  const scaleMode = options.scaleMode;

  // Calculate the center of the scene
  const sceneCenter = {
    x: options.size!.width / 2,
    y: options.size!.height / 2
  };

  // Calculate the center of the image
  const imageCenter = { x: info.width / 2, y: info.height / 2 };

  // Calculate the scale factor based on scaleMode
  let scaleFactor: number;
  if (scaleMode === "fill") {
    scaleFactor = Math.max(
      options.size!.width / info.width,
      options.size!.height / info.height
    );
  } else if (scaleMode === "fit") {
    const scaleAspectRatio = options.scaleAspectRatio || 1;
    scaleFactor =
      Math.min(
        options.size!.width / info.width,
        options.size!.height / info.height
      ) * scaleAspectRatio;
  } else {
    // Default behavior (unchanged)
    scaleFactor = Math.min(
      options.size!.width / info.width,
      options.size!.height / info.height
    );
  }

  // Calculate the transform values
  const transformX = sceneCenter.x - imageCenter.x;
  const transformY = sceneCenter.y - imageCenter.y;

  return {
    top: `${transformY}px`,
    left: `${transformX}px`,
    transform: `scale(${scaleFactor})`
  };
}

export const loadVideoItem = async (
  layer: ITrackItem & IVideo,
  options: Partial<OptionsType>
) => {
  const src = layer.details.src;
  const videoInfo = await getIVideotemInfo(layer);
  const position = getInitialPosition(options, {
    ...videoInfo
  });

  const trim = getTrim(layer.trim!, { duration: videoInfo.duration });
  const details: IVideoDetails = {
    width: videoInfo.width,
    height: videoInfo.height,
    opacity: 100,
    src: src,
    volume: layer.details.volume ?? 100, // Default volume
    borderRadius: layer.details.borderRadius ?? 0, // Default border radius
    borderWidth: layer.details.borderWidth ?? 0, // Default border width
    borderColor: layer.details.borderColor || "#000000", // Default border color
    boxShadow: layer.details.boxShadow || defaultShadow,
    top: layer.details.top || position.top || "0px", // Default top
    left: layer.details.left || position.left || "0px", // Default left
    transform: layer.details.transform || position.transform, // Default transform
    blur: layer.details.blur || 0,
    brightness: layer.details.brightness || 100,
    flipX: layer.details.flipX || false,
    flipY: layer.details.flipY || false,
    rotate: layer.details.rotate || "0deg",
    visibility: layer.details.visibility || "visible"
  };

  const videoItem = {
    ...layer,
    trim: trim,
    type: "video",
    name: "video",
    details,
    playbackRate: layer.playbackRate || 1,
    display: getDisplay(layer.display, { duration: videoInfo.duration, trim }),
    duration: videoInfo.duration
  };
  return videoItem;
};

export const loadAudioItem = async (payload: ITrackItem & IAudio) => {
  const id = payload.id;
  const details = payload.details;
  const audioData = await getAudioInfo(details.src);
  const duration = audioData.duration;
  const trim = getTrim(payload.trim!, { duration: duration });

  return {
    id,
    name: payload.name || "audio",
    type: "audio",
    display: getDisplay(payload.display, { duration, trim }),
    trim: trim,
    playbackRate: payload.playbackRate || 1,
    details: {
      src: details.src,
      volume: details.volume ?? 100 // Default volume
    },
    metadata: { ...payload.metadata },
    duration: duration
  };
};

export const loadProgressBarItem = async (
  payload: ITrackItem & IProgressBar,
  options: {
    size: ISize;
    scaleMode?: string;
    scaleAspectRatio?: number;
  }
) => {
  const id = payload.id;
  const size = {
    width: payload.details?.width || options.size.width,
    height: payload.details?.height || options.size.height
  };
  const details = payload.details;
  const position = getInitialPosition(options, size);
  const display: IDisplay = getDisplay(payload.display);

  return {
    id,
    name: payload.type,
    type: payload.type,
    display,
    details: {
      width: details?.width || size.width, // Default width
      height: details?.height || size.height, // Default height
      top: details?.top || position.top,
      left: details?.left || position.left,
      border: details.border || "none", // Default border
      borderRadius: details.borderRadius || 0, // Default border radius
      borderWidth: details.borderWidth || 0, // Default border width
      borderColor: details.borderColor || "#000000", // Default border color
      opacity: details.opacity || 100, // Default opacity
      flipX: details.flipX || false,
      flipY: details.flipY || false,
      inverted: details.inverted || false,
      backgroundColors: details?.backgroundColors || [
        "rgba(128, 128, 128,0.5)",
        "rgba(128, 128, 128,1)"
      ]
    },
    metadata: {}
  };
};

export const loadProgressFrameItem = async (
  payload: ITrackItem & IProgressFrame,
  options: {
    size: ISize;
    scaleMode?: string;
    scaleAspectRatio?: number;
  }
) => {
  const id = payload.id;
  const size = {
    width: payload.details?.width || options.size.width,
    height: payload.details?.height || options.size.height
  };
  const details = payload.details;
  const position = getInitialPosition(options, size);
  const display: IDisplay = getDisplay(payload.display);
  return {
    id,
    name: payload.type,
    type: payload.type,
    display,
    details: {
      width: details?.width || size.width, // Default width
      height: details?.height || size.height, // Default height
      top: details?.top || position.top,
      left: details?.left || position.left,
      border: details.border || "none", // Default border
      borderRadius: details.borderRadius || 0, // Default border radius
      borderWidth: details.borderWidth || 0, // Default border width
      borderColor: details.borderColor || "#000000", // Default border color
      opacity: details.opacity || 100, // Default opacity
      flipX: details.flipX || false,
      flipY: details.flipY || false,
      inverted: details.inverted || false,
      backgroundColors: details?.backgroundColors || [
        "rgba(128, 128, 128,0.5)",
        "rgba(128, 128, 128,1)"
      ],
      barThickness: details.barThickness || 10
    },
    metadata: {}
  };
};

export const loadRadialAudioBarsItem = async (
  payload: ITrackItem & IRadialAudioBars,
  options: {
    size: ISize;
    scaleMode?: string;
    scaleAspectRatio?: number;
  }
) => {
  const id = payload.id;
  const size = {
    width: payload.details?.width || options.size.width,
    height: payload.details?.height || options.size.height
  };
  const details = payload.details;
  const position = getInitialPosition(options, size);
  const display: IDisplay = getDisplay(payload.display);
  return {
    id,
    name: payload.type,
    type: payload.type,
    display,
    details: {
      width: details?.width || size.width, // Default width
      height: details?.height || size.height, // Default height
      top: details?.top || position.top,
      left: details?.left || position.left,
      radialBarColor: details.radialBarColor || "rgba(128, 128, 128,1)",
      border: details.border || "none", // Default border
      borderRadius: details.borderRadius || 0, // Default border radius
      borderWidth: details.borderWidth || 0, // Default border width
      borderColor: details.borderColor || "#000000", // Default border color
      opacity: details.opacity || 100, // Default opacity
      flipX: details.flipX || false,
      flipY: details.flipY || false
    },
    metadata: {}
  };
};

export const loadProgressSquareItem = async (
  payload: ITrackItem & IProgressSquare,
  options: {
    size: ISize;
    scaleMode?: string;
    scaleAspectRatio?: number;
  }
) => {
  const id = payload.id;
  const size = {
    width: payload.details?.width || options.size.width,
    height: payload.details?.height || options.size.height
  };
  const details = payload.details;
  const position = getInitialPosition(options, size);
  const display: IDisplay = getDisplay(payload.display);
  return {
    id,
    name: payload.type,
    type: payload.type,
    display,
    details: {
      width: details?.width || size.width, // Default width
      height: details?.height || size.height, // Default height
      top: details?.top || position.top,
      left: details?.left || position.left,
      border: details.border || "none", // Default border
      borderRadius: details.borderRadius || 0, // Default border radius
      borderWidth: details.borderWidth || 0, // Default border width
      borderColor: details.borderColor || "#000000", // Default border color
      opacity: details.opacity || 100, // Default opacity
      strokeColors: details?.strokeColors || ["#ff9800", "#ff5722"],
      strokeWidth: details?.strokeWidth || 100,
      strokeBackground: details?.strokeBackground || "#fff",
      flipX: details?.flipX || false,
      flipY: details?.flipY || false,
      rotate: details?.rotate || "0deg",
      transform: details?.transform || "none"
    },
    metadata: {}
  };
};

export const loadLinealAudioBarsItem = async (
  payload: ITrackItem & ILinealAudioBars,
  options: {
    size: ISize;
    scaleMode?: string;
    scaleAspectRatio?: number;
  }
) => {
  const id = payload.id;
  const size = {
    width: payload.details?.width || options.size.width,
    height: payload.details?.height || options.size.height
  };
  const details = payload.details;
  const position = getInitialPosition(options, size);

  return {
    id,
    name: payload.type,
    type: payload.type,
    display: {
      from: 0,
      to: payload.duration || 10000
    },
    details: {
      width: details?.width || size.width, // Default width
      height: details?.height || size.height, // Default height
      top: details?.top || position.top,
      left: details?.left || position.left,
      border: details.border || "none", // Default border
      borderRadius: details.borderRadius || 0, // Default border radius
      borderWidth: details.borderWidth || 0, // Default border width
      borderColor: details.borderColor || "#000000", // Default border color
      opacity: details.opacity || 100, // Default opacity
      flipX: details.flipX || false,
      flipY: details.flipY || false,
      inverted: details.inverted || false,
      linealBarColor: details.linealBarColor || "rgba(128, 128, 128,1)",
      lineThickness: details.lineThickness || 1,
      gapSize: details.gapSize || 1,
      roundness: details.roundness || 1,
      placement: details.placement || null,
      strokeColor: details.strokeColor || "#92E1B0",
      fillColor: details.fillColor || null,
      strokeWidth: details.strokeWidth || null,
      copies: details.copies || null,
      offsetPixelSpeed: details.offsetPixelSpeed || 0,
      lineColor: details.lineColor || "#92E1B0",
      lineGap: details.lineGap || 0,
      topRoundness: details.topRoundness || 0,
      bottomRoundness: details.bottomRoundness || 0,
      lines: details.lines || 0,
      sections: details.sections || 0
    },
    metadata: {}
  };
};

export const loadTemplateItem = async (
  payload: ITemplate,
  options: {
    size: ISize;
    scaleMode?: string;
    scaleAspectRatio?: number;
  }
) => {
  const ids = payload.trackItemIds;
  const size = payload.size || {
    width: payload.details.width!,
    height: payload.details.height!
  };
  const scale = Math.min(
    options.size.width / size.width,
    options.size.height / size.height
  );
  const rotate = payload.details?.rotate || 0;
  const position = getInitialPosition(options, size);
  const display = payload.display;
  let minFrom = Infinity;
  let maxTo = 0;
  ids.forEach((id) => {
    const item = payload.trackItemsMap[id];
    if (item.display.from < minFrom) minFrom = item.display.from;
    if (item.display.to > maxTo) maxTo = item.display.to;
  });
  const trim = payload.trim || payload.display || { from: minFrom, to: maxTo };
  return {
    id: payload.id,
    type: "template",
    details: {
      ...size,
      transform: payload.details.transform || position.transform, // Default transform
      top: payload.details.top || position.top,
      left: payload.details.left || position.left,
      scale,
      rotate,
      background: payload.details.background || "transparent"
    },
    trim,
    display: display || { from: minFrom, to: maxTo },
    activeEdit: false
  };
};

export const loadCompositionItem = async (
  payload: IComposition,
  options: {
    size: ISize;
    scaleMode?: string;
    scaleAspectRatio?: number;
  }
) => {
  const ids = payload.trackItemIds;
  const size = payload.size || {
    width: payload.details.width!,
    height: payload.details.height!
  };
  const scale = Math.min(
    options.size.width / size.width,
    options.size.height / size.height
  );
  const rotate = payload.details?.rotate || 0;
  const position = getInitialPosition(options, size);
  const display = payload.display;
  let minFrom = Infinity;
  let maxTo = 0;
  ids.forEach((id) => {
    const item = payload.trackItemsMap[id];
    if (item.display.from < minFrom) minFrom = item.display.from;
    if (item.display.to > maxTo) maxTo = item.display.to;
  });
  return {
    id: payload.id,
    type: "composition",
    details: {
      ...size,
      transform: payload.details.transform || position.transform, // Default transform
      top: payload.details.top || position.top,
      left: payload.details.left || position.left,
      scale,
      rotate
    },
    display: display || { from: minFrom, to: maxTo }
  };
};

export const loadIllustrationItem = async (
  payload: ITrackItem & IIllustration,
  options: {
    size?: { width: number; height: number };
    scaleMode?: string;
    scaleAspectRatio?: number;
  }
) => {
  const details = payload.details;
  const imageInfoAsync = getImageInfo(details.src);
  const svgStringAsync = fetch(details.src);
  const [imageInfo, svgStringResponse] = await Promise.all([
    imageInfoAsync,
    svgStringAsync
  ]);
  const svgStringDefault = await svgStringResponse.text();
  const position = getInitialPosition(options, imageInfo);

  const { serializer, colors } = prefixSvgClasses(
    convertSvgColorsToHex(svgStringDefault),
    payload.id,
    Number(details.width || imageInfo.width),
    Number(details.height || imageInfo.height)
  );

  const colorMap =
    payload.details.colorMap ||
    Object.fromEntries(colors.map((color) => [color, color]));

  return {
    id: payload.id,
    name: "illustration",
    type: payload.type,
    display: getDisplay(payload.display),
    playbackRate: payload.playbackRate || 1,
    details: {
      src: details.src || "", // Default source URL
      width: details.width || imageInfo.width || 100, // Default width
      height: details.height || imageInfo.height || 100, // Default height
      opacity: details.opacity ?? 100, // Default opacity
      transform: details.transform || position.transform, // Default transform
      border: details.border || "none", // Default border
      borderRadius: details.borderRadius || 0, // Default border radius
      top: details.top || position.top || "0px", // Default top
      left: details.left || position.left || "0px", // Default left
      borderWidth: details.borderWidth ?? 0, // Default border width
      borderColor: details.borderColor || "#000000", // Default border color
      flipX: details.flipX || false,
      flipY: details.flipY || false,
      rotate: details.rotate || "0deg",
      visibility: details.visibility || "visible",
      svgString: serializer,
      initialSvgString: cloneDeep(serializer),
      colorMap
    },
    metadata: payload.metadata || {}
  };
};

export const loadShapeItem = async (
  payload: ITrackItem & IShape,
  options: {
    size?: { width: number; height: number };
    scaleMode?: string;
    scaleAspectRatio?: number;
  }
) => {
  const details = payload.details;
  const imageInfoAsync = getImageInfo(details.src);
  const [imageInfo] = await Promise.all([imageInfoAsync]);
  const position = getInitialPosition(options, imageInfo);

  return {
    id: payload.id,
    name: "shape",
    type: payload.type,
    display: getDisplay(payload.display),
    playbackRate: payload.playbackRate || 1,
    details: {
      src: details.src || "", // Default source URL
      width: details.width || imageInfo.width || 100, // Default width
      height: details.height || imageInfo.height || 100, // Default height
      opacity: details.opacity ?? 100, // Default opacity
      transform: details.transform || position.transform, // Default transform
      border: details.border || "none", // Default border
      borderRadius: details.borderRadius || 0, // Default border radius
      top: details.top || position.top || "0px", // Default top
      left: details.left || position.left || "0px", // Default left
      borderWidth: details.borderWidth ?? 0, // Default border width
      borderColor: details.borderColor || "#000000", // Default border color
      flipX: details.flipX || false,
      flipY: details.flipY || false,
      rotate: details.rotate || "0deg",
      visibility: details.visibility || "visible",
      backgroundColor: details.backgroundColor || "#808080"
    },
    metadata: payload.metadata || {}
  };
};

export const loadRectItem = async (
  payload: ITrackItem & IRect,
  options: {
    size?: { width: number; height: number };
    scaleMode?: string;
    scaleAspectRatio?: number;
  }
) => {
  const details = payload.details;
  const position = getInitialPosition(options, {
    width: details.width,
    height: details.height
  });

  return {
    id: payload.id,
    name: "rect",
    type: payload.type,
    display: getDisplay(payload.display),
    playbackRate: payload.playbackRate || 1,
    details: {
      width: details.width || 100, // Default width
      height: details.height || 100, // Default height
      opacity: details.opacity ?? 100, // Default opacity
      transform: details.transform || position.transform, // Default transform
      border: details.border || "none", // Default border
      borderRadius: details.borderRadius || 0, // Default border radius
      top: details.top || position.top || "0px", // Default top
      left: details.left || position.left || "0px", // Default left
      borderWidth: details.borderWidth ?? 0, // Default border width
      borderColor: details.borderColor || "#000000", // Default border color
      flipX: details.flipX || false,
      flipY: details.flipY || false,
      rotate: details.rotate || "0deg",
      visibility: details.visibility || "visible",
      backgroundColor: details.backgroundColor || "#808080",
      boxShadow: details.boxShadow || defaultShadow, // Default box shadow
      blur: details.blur || 0,
      brightness: details.brightness || 100
    },
    metadata: payload.metadata || {}
  };
};

export const loadImageItem = async (
  payload: ITrackItem & IImage,
  options: {
    origin?: number;
    size?: { width: number; height: number };
    scaleMode?: string;
    scaleAspectRatio?: number;
  }
) => {
  const details = payload.details;
  const imageInfo = await getImageInfo(details.src);
  const position = getInitialPosition(options, imageInfo);
  return {
    id: payload.id,
    type: "image",
    name: "image",
    display: getDisplay(payload.display),
    playbackRate: payload.playbackRate || 1,
    details: {
      src: details.src || "", // Default source URL
      width: details.width || imageInfo.width || 100, // Default width
      height: details.height || imageInfo.height || 100, // Default height
      opacity: details.opacity ?? 100, // Default opacity
      transform: details.transform || position.transform, // Default transform
      border: details.border || "none", // Default border
      borderRadius: details.borderRadius || 0, // Default border radius
      boxShadow: details.boxShadow || defaultShadow, // Default box shadow
      top: details.top || position.top || "0px", // Default top
      left: details.left || position.left || "0px", // Default left
      borderWidth: details.borderWidth ?? 0, // Default border width
      borderColor: details.borderColor || "#000000", // Default border color
      blur: details.blur || 0,
      brightness: details.brightness || 100,
      flipX: details.flipX || false,
      flipY: details.flipY || false,
      rotate: details.rotate || "0deg",
      visibility: details.visibility || "visible"
    },
    metadata: payload.metadata || {}
  };
};

export const loadCaptionItem = async (
  trackItem: ITrackItem,
  options: {
    origin?: number;
    size?: { width: number; height: number };
  }
) => {
  const payload = trackItem as ICaption;
  if (payload.details.fontUrl) {
    await loadFonts([
      {
        fontFamily: payload.details.fontFamily,
        url: payload.details.fontUrl
      }
    ]);
  }
  const id = payload.id;
  const details = payload.details;
  const textStyles = createTextstyles(details);
  // Use existing height if already calculated, otherwise calculate it
  const textHeight =
    details.height || getTextInfo(payload.details.text, textStyles);

  // Use existing position if already set, otherwise calculate new position
  const position =
    details.top != null && details.left != null
      ? {
          top: `${details.top}px`,
          left: `${details.left}px`,
          transform: "none"
        }
      : getTextPosition(options, {
          width: textStyles.width,
          height: textHeight
        });
  return {
    id,
    name: "caption",
    type: "caption",
    display: getDisplay(payload.display),
    details: {
      ...payload.details,
      ...textStyles,
      text: details.text || "", // Default text content
      height: textHeight, // Default height
      fontUrl: details.fontUrl,
      top: textStyles.top || position.top,
      left: textStyles.left || position.left,
      borderWidth: details.borderWidth || 0,
      borderColor: details.borderColor || "#000000",
      boxShadow: details.boxShadow || defaultShadow,
      words: details.words || [],
      appearedColor: details.appearedColor || details.color,
      activeColor: details.activeColor || details.color,
      activeFillColor: details.activeFillColor || "transparent",
      isKeywordColor: details.isKeywordColor || "transparent",
      preservedColorKeyWord: details.preservedColorKeyWord || false,
      linesPerCaption: details.linesPerCaption || 2,
      wordsPerLine: details.wordsPerLine || "punctuationOrPause"
    },
    metadata: trackItem.metadata || {}
  };
};

export const loadTextItem = async (
  payload: ITrackItem & IText,
  options: {
    origin?: number;
    size?: { width: number; height: number };
  }
) => {
  if (payload.details.fontUrl) {
    await loadFonts([
      {
        fontFamily: payload.details.fontFamily,
        url: payload.details.fontUrl
      }
    ]);
  }

  const id = payload.id;
  const details = payload.details;
  const textStyles = createTextstyles(details);
  // Use existing height if already calculated, otherwise calculate it
  const textHeight =
    details.height || getTextInfo(payload.details.text, textStyles);

  // Use existing position if already set, otherwise calculate new position
  const position =
    details.top != null && details.left != null
      ? {
          top: `${details.top}px`,
          left: `${details.left}px`,
          transform: "none"
        }
      : getTextPosition(options, {
          width: textStyles.width,
          height: textHeight
        });

  return {
    id,
    name: "text",
    type: "text",
    display: getDisplay(payload.display),
    details: {
      ...payload.details,
      ...textStyles,
      text: details.text || "", // Default text content
      height: textHeight, // Default height
      fontUrl: details.fontUrl,
      top: textStyles.top || position.top,
      left: textStyles.left || position.left,
      borderWidth: details.borderWidth || 0,
      borderColor: details.borderColor || "#000000",
      boxShadow: details.boxShadow || defaultShadow
    },
    metadata: {}
  };
};

const createTextstyles = (details: ITextDetails) => {
  const textStyles: ITextDetails = {
    fontFamily: details.fontFamily || "Arial", // Default font family
    fontSize: details.fontSize || "16px", // Default font size
    fontWeight: details.fontWeight || "normal", // Default font weight
    fontStyle: details.fontStyle || "normal", // Default font style
    textDecoration: details.textDecoration || "none", // Default text decoration
    textAlign: details.textAlign || "left", // Default text alignment
    lineHeight: details.lineHeight || "normal", // Default line height
    letterSpacing: details.letterSpacing || "normal", // Default letter spacing
    wordSpacing: details.wordSpacing || "normal", // Default word spacing
    color: details.color || "#ffffff", // Default text color (black)
    backgroundColor: details.backgroundColor || "transparent", // Default background color
    border: details.border || "none", // Default border
    textShadow: details.textShadow || "none", // Default text shadow
    text: details.text || "", // Default text content
    opacity: details.opacity ?? 100, // Default opacity
    width: details.width || 300,
    wordWrap: details.wordWrap || "normal", //'break-word'
    wordBreak: details.wordBreak || "normal", //'break-all',
    WebkitTextStrokeColor: details.WebkitTextStrokeColor || "#ffffff",
    WebkitTextStrokeWidth: details.WebkitTextStrokeWidth || "0px",
    top: details.top,
    left: details.left,
    textTransform: details.textTransform || "none",
    transform: details.transform || "none",
    skewX: details.skewX || 0,
    skewY: details.skewY || 0
  } as ITextDetails;

  return textStyles;
};

export const loadTrackItem = async (
  payload: ITrackItem &
    (IVideo | IAudio | IImage | IText | ICaption | ITemplate),
  options?: {
    size?: { width: number; height: number };
    origin?: number;
    scaleMode?: string;
    scaleAspectRatio?: number;
  }
) => {
  switch (payload.type) {
    case "video":
      return loadVideoItem(payload as ITrackItem & IVideo, options || {});

    case "audio":
      return loadAudioItem(payload as ITrackItem & IAudio);

    case "image":
      return loadImageItem(payload as ITrackItem & IImage, options || {});

    case "text":
      return loadTextItem(payload as ITrackItem & IText, options || {});

    case "caption":
      return loadCaptionItem(payload as ITrackItem & ICaption, options || {});

    case "template":
      return loadTemplateItem(payload as ITrackItem & ITemplate, {
        size: options?.size as ISize
      });
    default:
      throw new Error(`Unsupported track item`);
  }
};

export function checkIfItemIsInTrack(tracks: ITrack[], trackItemIds: string[]) {
  return trackItemIds.some((trackItemId) =>
    tracks.some((track) => track.items.includes(trackItemId))
  );
}

export function checkIfTrackExists(
  currentTracks: ITrack[],
  nextTracks: ITrack[]
) {
  return nextTracks.some((track) =>
    currentTracks.some((currentTrack) => currentTrack.id === track.id)
  );
}

export const loadTracks = (
  tracks: Partial<ITrack>[] = [],
  trackItems: ITrackItem[] = []
): ITrack[] => {
  // create new tracks if no tracks are provided
  if (tracks.length === 0) {
    const tracks = trackItems.map((trackItem) => {
      return {
        id: generateId(),
        items: [trackItem.id],
        type: trackItem.type,
        accepts: ["text", "image", "video", "audio", "caption", "template"]
      };
    }) as ITrack[];
    return tracks;
  }

  return tracks.map((track) => {
    return {
      ...track,
      items: track.items || [],
      accepts: ["audio", "video", "image", "text", "caption", "template"],
      type: track.type || "text",
      magnetic: track.magnetic || false,
      static: track.static || false,
      id: track.id || generateId(),
      muted: track.muted || false
    };
  });
  //
};
