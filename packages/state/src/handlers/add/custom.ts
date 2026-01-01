import {
  State,
  IRadialAudioBars,
  IProgressBar,
  IProgressFrame,
  ILinealAudioBars,
  IProgressSquare
} from "@designcombo/types";
import { cloneDeep } from "lodash";
import {
  loadLinealAudioBarsItem,
  loadProgressBarItem,
  loadProgressFrameItem,
  loadProgressSquareItem,
  loadRadialAudioBarsItem
} from "../../utils/load-item";
import { getDuration } from "../../utils/duration";
import { alignMagneticTracks } from "../../utils/align-tracks";
import { manageTracks } from "../../utils/manage-tracks";
interface CustomOptions {
  targetTrackIndex?: number;
  targetTrackId?: string;
  scaleMode?: string;
  scaleAspectRatio?: number;
}

export async function addGeneric(
  state: State,
  payload:
    | IProgressBar
    | IProgressFrame
    | IRadialAudioBars
    | ILinealAudioBars
    | IProgressSquare,
  options: CustomOptions = {},
  type:
    | "progress-bar"
    | "progress-frame"
    | "radial-audio-bars"
    | "lineal-audio-bars"
    | "wave-audio-bars"
    | "hill-audio-bars"
    | "progress-square"
): Promise<Partial<State>> {
  const currentState = cloneDeep(state);

  const getDefaultWaveDisplay = (
    payload: IRadialAudioBars | ILinealAudioBars
  ) => {
    if (!payload.display) {
      return {
        from: 0,
        to: currentState.duration
      };
    }
    return payload.display;
  };

  const trackItemsPromise = [];

  if (type === "progress-bar") {
    trackItemsPromise.push(
      loadProgressBarItem(payload as IProgressBar, {
        size: currentState.size,
        scaleMode: options.scaleMode,
        scaleAspectRatio: options.scaleAspectRatio
      })
    );
  }
  if (type === "progress-frame") {
    trackItemsPromise.push(
      loadProgressFrameItem(payload as IProgressFrame, {
        size: currentState.size,
        scaleMode: options.scaleMode,
        scaleAspectRatio: options.scaleAspectRatio
      })
    );
  }
  if (type === "radial-audio-bars") {
    payload.display = getDefaultWaveDisplay(payload as IRadialAudioBars);
    trackItemsPromise.push(
      loadRadialAudioBarsItem(payload as IRadialAudioBars, {
        size: currentState.size,
        scaleMode: options.scaleMode,
        scaleAspectRatio: options.scaleAspectRatio
      })
    );
  }
  if (type === "lineal-audio-bars") {
    payload.display = getDefaultWaveDisplay(payload as ILinealAudioBars);
    trackItemsPromise.push(
      loadLinealAudioBarsItem(payload as ILinealAudioBars, {
        size: currentState.size,
        scaleMode: options.scaleMode,
        scaleAspectRatio: options.scaleAspectRatio
      })
    );
  }

  if (type === "wave-audio-bars") {
    payload.display = getDefaultWaveDisplay(payload as IRadialAudioBars);
    trackItemsPromise.push(
      loadLinealAudioBarsItem(payload as ILinealAudioBars, {
        size: currentState.size,
        scaleMode: options.scaleMode,
        scaleAspectRatio: options.scaleAspectRatio
      })
    );
  }

  if (type === "hill-audio-bars") {
    payload.display = getDefaultWaveDisplay(payload as IRadialAudioBars);
    trackItemsPromise.push(
      loadLinealAudioBarsItem(payload as ILinealAudioBars, {
        size: currentState.size,
        scaleMode: options.scaleMode,
        scaleAspectRatio: options.scaleAspectRatio
      })
    );
  }

  if (type === "progress-square") {
    trackItemsPromise.push(
      loadProgressSquareItem(payload as IProgressSquare, {
        size: currentState.size,
        scaleMode: options.scaleMode,
        scaleAspectRatio: options.scaleAspectRatio
      })
    );
  }

  const trackItems = await Promise.all(trackItemsPromise);
  const newIds = trackItems.map((trackItem) => trackItem.id);

  const updatedState = manageTracks(currentState, trackItems, options);
  updatedState.duration = getDuration(updatedState.trackItemsMap);

  const magneticTracks = updatedState.tracks.filter((t) => t.magnetic);
  alignMagneticTracks(magneticTracks, updatedState.trackItemsMap, newIds);

  return {
    trackItemIds: updatedState.trackItemIds,
    trackItemsMap: updatedState.trackItemsMap,
    tracks: updatedState.tracks,
    duration: updatedState.duration
  };
}
