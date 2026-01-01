import { ICompositionAnimation, State } from "@designcombo/types";
import cloneDeep from "lodash.clonedeep";
import { loadFonts } from "../../utils/fonts";

interface Animations {
  in?: any;
  out?: any;
  loop?: any;
  timed?: any;
}

interface AnimationPayload {
  id: string;
  animations: Animations;
}

export async function addAnimation(
  state: State,
  payload: AnimationPayload
): Promise<Partial<State>> {
  const currentState = cloneDeep(state);
  const trackItem = currentState.trackItemsMap[payload.id];
  const fonts: { fontFamily: string; url: string }[] = [];

  if (!trackItem) return {};

  let animations: Animations = trackItem.animations || {};

  if (payload.animations.loop) {
    payload.animations.loop.composition.forEach(
      (composition: ICompositionAnimation) => {
        if (composition.details?.fonts) {
          fonts.push(...composition.details.fonts);
        }
      }
    );
  } else if (payload.animations.in) {
    payload.animations.in.composition.forEach(
      (composition: ICompositionAnimation) => {
        if (composition.details?.fonts) {
          fonts.push(...composition.details.fonts);
        }
      }
    );
  } else if (payload.animations.out) {
    payload.animations.out.composition.forEach(
      (composition: ICompositionAnimation) => {
        if (composition.details?.fonts) {
          fonts.push(...composition.details.fonts);
        }
      }
    );
  } else if (payload.animations.timed) {
    payload.animations.timed.composition.forEach(
      (composition: ICompositionAnimation) => {
        if (composition.details?.fonts) {
          fonts.push(...composition.details.fonts);
        }
      }
    );
  }

  if (fonts.length > 0) {
    await loadFonts(fonts);
  }

  if (animations.in && payload.animations.in) {
    animations.in = payload.animations.in;
  } else if (animations.out && payload.animations.out) {
    animations.out = payload.animations.out;
  } else if (animations.loop && payload.animations.loop) {
    animations.loop = payload.animations.loop;
  } else if (!animations.out && payload.animations.out) {
    animations.out = payload.animations.out;
  } else if (!animations.in && payload.animations.in) {
    animations.in = payload.animations.in;
  } else if (!animations.loop && payload.animations.loop) {
    animations.loop = payload.animations.loop;
  } else {
    animations = payload.animations;
  }

  if (
    payload.animations.in ||
    payload.animations.out ||
    payload.animations.loop
  ) {
    delete animations.timed;
  }

  if (payload.animations.timed) {
    animations.timed = payload.animations.timed;
    delete animations.in;
    delete animations.out;
    delete animations.loop;
  }

  trackItem.animations = animations as any;
  return {
    trackItemsMap: currentState.trackItemsMap
  };
}
