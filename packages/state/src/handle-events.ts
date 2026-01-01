import { dispatch, filter, subject } from "@designcombo/events";
import {
  ACTIVE_PASTE,
  ACTIVE_PREFIX,
  ACTIVE_SPLIT,
  ADD_AUDIO,
  ADD_CAPTIONS,
  ADD_IMAGE,
  ADD_PREFIX,
  ADD_TEMPLATE,
  ADD_TEXT,
  ADD_VIDEO,
  DESIGN_LOAD,
  DESIGN_PREFIX,
  DESIGN_RESIZE,
  EDIT_OBJECT,
  EDIT_PREFIX,
  HISTORY_PREFIX,
  HISTORY_REDO,
  HISTORY_UNDO,
  LAYER_CLONE,
  LAYER_DELETE,
  LAYER_PREFIX,
  LAYER_REPLACE,
  REPLACE_MEDIA,
  TIMELINE_SCALE_CHANGED,
  TIMELINE_SCALE_PREFIX,
  ADD_ANIMATION,
  ADD_COMPOSITION,
  ADD_ILLUSTRATION,
  ADD_SHAPE,
  EDIT_BACKGROUND_EDITOR,
  EDIT_BULK,
  LAYER_COPY,
  LAYER_SELECT,
  ADD_PROGRESS_BAR,
  ADD_PROGRESS_FRAME,
  ADD_RADIAL_AUDIO_BARS,
  ADD_LINEAL_AUDIO_BARS,
  ADD_WAVE_AUDIO_BARS,
  ADD_HILL_AUDIO_BARS,
  ADD_RECT,
  ADD_PROGRESS_SQUARE,
  EDIT_TRACK
} from "./events";
import StateManager, { ADD_ITEMS } from ".";
import { cloneDeep } from "lodash";

import { State, IBulkAction } from "@designcombo/types";
import { deleteLayer } from "./handlers/delete-layer";
import { pasteLayer } from "./handlers/paste-layer";
import { replaceLayer } from "./handlers/replace-layer";
import { duplicateLayer } from "./handlers/duplicate-layer";
import { loadDesign } from "./handlers/load-design";
import { copyLayer } from "./handlers/copy-layer";
import { splitLayer } from "./handlers/split-layer";
import { editObject } from "./handlers/edit-object";
import { replaceMedia } from "./handlers/replace-media";
import { editBackground } from "./handlers/edit-background";
import { addItems } from "./handlers/add/items";
import { addImage } from "./handlers/add/image";
import { addAudio } from "./handlers/add/audio";
import { addVideo } from "./handlers/add/video";
import { addText } from "./handlers/add/text";
import { addShape } from "./handlers/add/shape";
import { addIllustration } from "./handlers/add/illustration";
import { addComposition } from "./handlers/add/composition";
import { addGeneric } from "./handlers/add/custom";
import { addTemplate } from "./handlers/add/template";
import { addCaptions } from "./handlers/add/captions";
import { addAnimation } from "./handlers/add/animation";
import { addRect } from "./handlers/add/rect";
import { editTrack } from "./handlers/edit-track";

// Integrate it with state updates as needed
function handleStateEvents(state: StateManager) {
  const bulkEvents = subject.pipe(
    filter(({ key }) => key.startsWith(EDIT_BULK))
  );
  const designEvents = subject.pipe(
    filter(({ key }) => key.startsWith(DESIGN_PREFIX))
  );

  const addEvents = subject.pipe(
    filter(({ key }) => key.startsWith(ADD_PREFIX))
  );

  const selectEvents = subject.pipe(
    filter(({ key }) => key.startsWith(LAYER_PREFIX))
  );

  const historyEvents = subject.pipe(
    filter(({ key }) => key.startsWith(HISTORY_PREFIX))
  );

  const itemEvents = subject.pipe(
    filter(({ key }) => key.startsWith(ACTIVE_PREFIX))
  );

  const updateEvents = subject.pipe(
    filter(({ key }) => key.startsWith(EDIT_PREFIX))
  );

  const scaleEvents = subject.pipe(
    filter(({ key }) => key.startsWith(TIMELINE_SCALE_PREFIX))
  );

  const bulkSubscription = bulkEvents.subscribe(async (obj) => {
    if (obj.key === EDIT_BULK) {
      const { actions } = obj.value?.payload;
      (actions as IBulkAction[]).forEach((action) => {
        dispatch(action.type, action.payload && { payload: action.payload });
      });
    }
  });

  const designSubscription = designEvents.subscribe(async (obj) => {
    if (obj.key === DESIGN_LOAD) {
      const data = obj.value?.payload;
      const updatedState = await loadDesign(state.getState(), data);
      state.updateState(updatedState, {
        kind: "design:load",
        updateHistory: false
      });
    }
    if (obj.key === DESIGN_RESIZE) {
      const size = obj.value?.payload;

      state.updateState(
        {
          size
        },
        {
          kind: "design:resize",
          updateHistory: false
        }
      );
    }
  });

  const historySubscription = historyEvents.subscribe((obj) => {
    if (obj.key === HISTORY_UNDO) return state.undo();
    if (obj.key === HISTORY_REDO) return state.redo();
  });

  const scaleSubscription = scaleEvents.subscribe((obj) => {
    if (obj.key === TIMELINE_SCALE_CHANGED) {
      const scale = obj.value?.payload.scale;
      state.updateState(
        {
          scale
        },
        {
          kind: "update",
          updateHistory: false
        }
      );
    }
  });
  const layerSubscription = selectEvents.subscribe(async (obj) => {
    if (obj.key === LAYER_SELECT) {
      const ids: string[] = obj.value?.payload.trackItemIds || [];
      state.updateState(
        { activeIds: ids },
        {
          kind: "update",
          updateHistory: false
        }
      );
    }

    if (obj.key === LAYER_COPY) {
      copyLayer(state.getState());
    }

    if (obj.key === LAYER_DELETE) {
      const ids = obj.value?.payload.trackItemIds;
      const updatedState = deleteLayer(state.getState(), ids);
      state.updateState(updatedState, { updateHistory: true, kind: "remove" });
    }
    if (obj.key === LAYER_CLONE) {
      const updatedState = duplicateLayer(
        state.getState(),
        obj.value?.payload.trackItemIds
      );
      state.updateState(updatedState, {
        updateHistory: true,
        kind: "update"
      });
    }
    if (obj.key === LAYER_REPLACE) {
      const data = obj.value?.payload;
      const updatedState = await replaceLayer(state.getState(), data);
      state.updateState(updatedState, {
        updateHistory: true,
        kind: "update:details"
      });
    }
  });

  const addItemSubscription = addEvents.subscribe(async (obj) => {
    const currentState = cloneDeep(state.getState());
    const isSelected = obj.value?.options?.isSelected || false;
    const scaleMode = obj.value?.options?.scaleMode;
    const scaleAspectRatio = obj.value?.options?.scaleAspectRatio;
    const trackIndex: number = obj.value?.options?.trackIndex;

    let updatedState: Partial<State> = {};

    if (obj.key === ADD_ANIMATION) {
      updatedState = await addAnimation(currentState, obj.value?.payload);
    } else if (obj.key === ADD_ITEMS) {
      updatedState = await addItems(currentState, obj.value?.payload, {
        trackIndex
      });
    } else if (obj.key === ADD_CAPTIONS) {
      updatedState = await addCaptions(currentState, obj.value?.payload, {
        trackIndex
      });
    } else if (obj.key === ADD_TEXT) {
      updatedState = await addText(currentState, obj.value?.payload, {
        targetTrackIndex: trackIndex,
        targetTrackId: obj.value?.options.targetTrackId,
        size: currentState.size,
        isNewTrack: obj.value?.options?.isNewTrack
      });
    } else if (obj.key === ADD_TEMPLATE) {
      updatedState = await addTemplate(currentState, obj.value?.payload, {
        scaleMode,
        scaleAspectRatio,
        targetTrackIndex: trackIndex,
        targetTrackId: obj.value?.options?.targetTrackId
      });
    } else if (obj.key === ADD_ILLUSTRATION) {
      updatedState = await addIllustration(currentState, obj.value?.payload, {
        scaleMode,
        scaleAspectRatio,
        targetTrackIndex: trackIndex,
        targetTrackId: obj.value?.options.targetTrackId
      });
    } else if (obj.key === ADD_SHAPE) {
      updatedState = await addShape(currentState, obj.value?.payload, {
        scaleMode,
        scaleAspectRatio,
        targetTrackIndex: trackIndex,
        targetTrackId: obj.value?.options.targetTrackId
      });
    } else if (obj.key === ADD_RECT) {
      updatedState = await addRect(currentState, obj.value?.payload, {
        scaleMode,
        scaleAspectRatio,
        targetTrackIndex: trackIndex,
        targetTrackId: obj.value?.options.targetTrackId
      });
    } else if (obj.key === ADD_IMAGE) {
      updatedState = await addImage(currentState, obj.value?.payload, {
        scaleMode,
        scaleAspectRatio,
        targetTrackIndex: trackIndex,
        targetTrackId: obj.value?.options.targetTrackId,
        isNewTrack: obj.value?.options?.isNewTrack
      });
    } else if (obj.key === ADD_AUDIO) {
      updatedState = await addAudio(currentState, obj.value?.payload, {
        targetTrackIndex: trackIndex,
        targetTrackId: obj.value?.options.targetTrackId,
        isNewTrack: obj.value?.options?.isNewTrack
      });
    } else if (obj.key === ADD_VIDEO) {
      updatedState = await addVideo(currentState, obj.value?.payload, {
        scaleMode,
        scaleAspectRatio,
        targetTrackIndex: trackIndex,
        targetTrackId: obj.value?.options.targetTrackId,
        isNewTrack: obj.value?.options?.isNewTrack
      });
    } else if (obj.key === ADD_COMPOSITION) {
      updatedState = await addComposition(currentState, obj.value?.payload, {
        scaleMode,
        scaleAspectRatio,
        targetTrackIndex: trackIndex,
        targetTrackId: obj.value?.options.targetTrackId
      });
    } else if (obj.key === ADD_PROGRESS_BAR) {
      updatedState = await addGeneric(
        currentState,
        obj.value?.payload,
        {
          targetTrackIndex: trackIndex,
          targetTrackId: obj.value?.options?.targetTrackId
        },
        "progress-bar"
      );
    } else if (obj.key === ADD_PROGRESS_SQUARE) {
      updatedState = await addGeneric(
        currentState,
        obj.value?.payload,
        {
          targetTrackIndex: trackIndex,
          targetTrackId: obj.value?.options?.targetTrackId
        },
        "progress-square"
      );
    } else if (obj.key === ADD_PROGRESS_FRAME) {
      updatedState = await addGeneric(
        currentState,
        obj.value?.payload,
        {
          targetTrackIndex: trackIndex,
          targetTrackId: obj.value?.options?.targetTrackId
        },
        "progress-frame"
      );
    } else if (obj.key === ADD_RADIAL_AUDIO_BARS) {
      updatedState = await addGeneric(
        currentState,
        obj.value?.payload,
        {
          targetTrackIndex: trackIndex,
          targetTrackId: obj.value?.options?.targetTrackId
        },
        "radial-audio-bars"
      );
    } else if (obj.key === ADD_LINEAL_AUDIO_BARS) {
      updatedState = await addGeneric(
        currentState,
        obj.value?.payload,
        {
          targetTrackIndex: trackIndex,
          targetTrackId: obj.value?.options?.targetTrackId
        },
        "lineal-audio-bars"
      );
    } else if (obj.key === ADD_WAVE_AUDIO_BARS) {
      updatedState = await addGeneric(
        currentState,
        obj.value?.payload,
        {
          targetTrackIndex: trackIndex,
          targetTrackId: obj.value?.options?.targetTrackId
        },
        "wave-audio-bars"
      );
    } else if (obj.key === ADD_HILL_AUDIO_BARS) {
      updatedState = await addGeneric(
        currentState,
        obj.value?.payload,
        {
          targetTrackIndex: trackIndex,
          targetTrackId: obj.value?.options?.targetTrackId
        },
        "hill-audio-bars"
      );
    }

    if (isSelected && updatedState.trackItemIds) {
      updatedState.activeIds = updatedState.trackItemIds;
    }

    state.updateState(updatedState, {
      updateHistory: true,
      kind: "add"
    });
  });

  const itemsEventSubscription = itemEvents.subscribe(async (obj) => {
    if (obj.key === ACTIVE_SPLIT) {
      const currentTime = obj.value?.options.time;
      const updatedState = splitLayer(state.getState(), currentTime);
      if (Object.keys(updatedState).length > 0) {
        state.updateState(updatedState, {
          updateHistory: true,
          kind: "update"
        });
      }
    }

    if (obj.key === ACTIVE_PASTE) {
      const updatedState = await pasteLayer(state.getState());
      state.updateState(updatedState, {
        updateHistory: true,
        kind: "update"
      });
    }
  });

  const updateItemSubscription = updateEvents.subscribe(async (obj) => {
    if (obj.key === EDIT_OBJECT) {
      const updatedState = await editObject(
        state.getState(),
        obj.value?.payload
      );
      state.updateState(updatedState, {
        updateHistory: true,
        kind: "update:details"
      });
    }
    if (obj.key === EDIT_TRACK) {
      const updatedState = await editTrack(
        state.getState(),
        obj.value?.payload
      );
      state.updateState(updatedState, {
        updateHistory: true,
        kind: "edit:track"
      });
    }
    if (obj.key === REPLACE_MEDIA) {
      const updatedState = await replaceMedia(
        state.getState(),
        obj.value?.payload
      );
      state.updateState(updatedState, {
        updateHistory: true,
        kind: "update:details"
      });
    }
    if (obj.key === EDIT_BACKGROUND_EDITOR) {
      const updatedState = editBackground(state.getState(), obj.value?.payload);
      state.updateState(updatedState, {
        updateHistory: true,
        kind: "update:details"
      });
    }
  });

  return {
    unsubscribe: () => {
      addItemSubscription.unsubscribe();
      itemsEventSubscription.unsubscribe();
      updateItemSubscription.unsubscribe();
      historySubscription.unsubscribe();
      layerSubscription.unsubscribe();
      designSubscription.unsubscribe();
      scaleSubscription.unsubscribe();
      bulkSubscription.unsubscribe();
    }
  };
}

export default handleStateEvents;
