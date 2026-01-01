import { State, ICompositionAnimation } from "@designcombo/types";
import { loadFonts } from "../utils/fonts";
import { getDuration } from "../utils/duration";
import { transfString } from "../utils/load-illustration";
import { loadIllustrationItem } from "../utils/load-item";

interface FontToLoad {
  fontFamily: string;
  url: string;
}

export async function loadDesign(_: State, data: any): Promise<Partial<State>> {
  const trackItemsMap = data.trackItemsMap;

  // Collect all fonts that need to be loaded
  const fontsToLoad = new Set<string>();
  const illustrationItems = new Map();

  // First pass: collect all fonts and illustration items
  for (const id in trackItemsMap) {
    const item = trackItemsMap[id];

    if (item.type === "text" || item.type === "caption") {
      if (item.details.fontUrl) {
        const font: FontToLoad = {
          fontFamily: item.details.fontFamily,
          url: item.details.fontUrl
        };
        fontsToLoad.add(JSON.stringify(font));
      }
      if (item.animations?.in) {
        item.animations.in.composition.forEach(
          (animation: ICompositionAnimation) => {
            if (animation.details?.fonts) {
              animation.details.fonts.forEach(
                (font: { fontFamily: string; url: string }) => {
                  fontsToLoad.add(JSON.stringify(font));
                }
              );
            }
          }
        );
      }
      if (item.animations?.loop) {
        item.animations.loop.composition.forEach(
          (animation: ICompositionAnimation) => {
            if (animation.details?.fonts) {
              animation.details.fonts.forEach(
                (font: { fontFamily: string; url: string }) => {
                  fontsToLoad.add(JSON.stringify(font));
                }
              );
            }
          }
        );
      }
      if (item.animations?.out) {
        item.animations.out.composition.forEach(
          (animation: ICompositionAnimation) => {
            if (animation.details?.fonts) {
              animation.details.fonts.forEach(
                (font: { fontFamily: string; url: string }) => {
                  fontsToLoad.add(JSON.stringify(font));
                }
              );
            }
          }
        );
      }
    } else if (item.type === "illustration") {
      illustrationItems.set(id, {
        trackItem: item,
        details: item.details
      });
    }
  }

  // Load all fonts at once
  if (fontsToLoad.size > 0) {
    await loadFonts(
      Array.from(fontsToLoad).map((font) => JSON.parse(font) as FontToLoad)
    );
  }

  // Process illustration items
  for (const [id, item] of illustrationItems) {
    const loadedItem = await loadIllustrationItem(
      { ...item.trackItem, details: item.details },
      {
        size: { width: item.details.width, height: item.details.height }
      }
    );
    const svgStringData = transfString(
      loadedItem.details.svgString,
      item.details.colorMap
    );
    loadedItem.details.svgString = svgStringData;
    trackItemsMap[id] = loadedItem;
  }

  const duration = getDuration(trackItemsMap);

  return {
    ...data,
    duration
  };
}
