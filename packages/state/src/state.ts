import { BehaviorSubject } from "rxjs";
import {
  IKindHistory,
  IStateManager,
  ITrack,
  IUpdateStateOptions,
  State,
  ITimelineScaleState
} from "@designcombo/types";
import isEqual from "lodash.isequal";
import handleStateEvents from "./handle-events";
import microdiff, { Difference } from "microdiff";
import { Patch, applyPatches, enablePatches, produce } from "immer";
import pick from "lodash.pick";
import { DEFAULT_FPS, DEFAULT_SIZE } from "./constants/design";
import { getDuration } from "./utils/duration";
import cloneDeep from "lodash.clonedeep";
import { setStateOptions } from "./state-options";

// Define a clear configuration interface
interface StateManagerConfig {
  cors?: {
    audio?: boolean;
    video?: boolean;
    image?: boolean;
  };
  acceptsMap?: Record<string, string[]>;
  scale?: ITimelineScaleState;
}

const initialState: State = {
  size: DEFAULT_SIZE,
  fps: DEFAULT_FPS,
  tracks: [],
  trackItemIds: [],
  trackItemsMap: {},
  transitionIds: [],
  transitionsMap: {},
  scale: {
    // 1x distance (second 0 to second 5, 5 segments).
    index: 7,
    unit: 300,
    zoom: 1 / 300,
    segments: 5
  },
  duration: 0,
  activeIds: [],
  structure: [],
  background: {
    type: "color",
    value: "transparent"
  }
};

const CORE_HISTORY_ELEMENTS = [
  "tracks",
  "trackItemsMap",
  "transitionIds",
  "transitionsMap",
  "trackItemIds",
  "structure"
];

interface StateHistory {
  handleUndo: boolean;
  handleRedo: boolean;
}

class StateManager implements IStateManager {
  private stateSubject: BehaviorSubject<State>;
  private stateHistorySubject: BehaviorSubject<StateHistory>;
  private prevState: State;
  public background: State["background"];
  public undos: { undos: Difference[]; type: IKindHistory }[] = [];
  public redos: { redos: Difference[]; type: IKindHistory }[] = [];
  private listener: {
    unsubscribe: () => void;
  };

  // Clean constructor with clear configuration interface
  constructor(state?: Partial<State>, config?: StateManagerConfig) {
    const initial = Object.assign(
      {},
      initialState,
      state,
      config?.scale ? { scale: config.scale } : {}
    );
    this.stateSubject = new BehaviorSubject<State>(initial);
    this.stateHistorySubject = new BehaviorSubject<StateHistory>({
      handleRedo: false,
      handleUndo: false
    });
    this.background = initial.background;
    this.prevState = initial; // Store the initial state as previous state

    // Set global state options
    if (config?.cors || config?.acceptsMap) {
      setStateOptions({
        cors: config.cors,
        acceptsMap: config.acceptsMap
      });
    }

    this.initListeners();
  }

  public initListeners() {
    handleStateEvents(this);
  }
  public destroyListeners() {
    if (this.listener) {
      this.listener.unsubscribe();
    }
  }
  public purge() {
    this.destroyListeners();
  }

  public updateHistory(newState: State, type: IKindHistory) {
    const nextState = pick(newState, CORE_HISTORY_ELEMENTS);
    const currentState = pick(this.getState(), CORE_HISTORY_ELEMENTS);

    const diff = microdiff(currentState, nextState);
    if (diff.length) {
      this.undos.push({ undos: diff, type });
      this.redos = [];
    }
  }

  getStateHistory() {
    return this.stateHistorySubject.getValue();
  }

  subscribeHistory(callback: (history: StateHistory) => void) {
    return this.stateHistorySubject.subscribe(callback);
  }

  // Get the current state
  getState() {
    return this.stateSubject.getValue();
  }

  // Subscribe to state changes
  subscribe(callback: (state: State) => void) {
    return this.stateSubject.subscribe(callback);
  }

  // Update the state, emitting only if the part of the state has changed
  updateState(
    partialState: Partial<State>,
    options: IUpdateStateOptions = { updateHistory: false }
  ) {
    const currentState = this.getState();
    const newState = {
      ...cloneDeep(currentState),
      ...cloneDeep(partialState)
    };
    // Emit only if state has actually changed
    if (!isEqual(currentState, newState)) {
      if (options.updateHistory) {
        this.updateHistory(newState, options.kind!);
      }
      this.prevState = currentState; // Save the previous state
      this.stateSubject.next(newState);
    }
  }

  // emit changes for design size

  subscribeToUpdateStateDetails(
    callback: (stateDetails: {
      size: State["size"];
      background: State["background"];
    }) => void
  ) {
    return this.stateSubject.asObservable().subscribe((state) => {
      if (
        !isEqual(state.size, this.prevState.size) ||
        !isEqual(state.background, this.prevState.background)
      ) {
        callback({
          size: state.size,
          background: state.background
        });
      }
    });
  }

  // Selectively subscribe to scale changes
  subscribeToScale(callback: (v: { scale: State["scale"] }) => void) {
    return this.stateSubject.asObservable().subscribe((state) => {
      if (!isEqual(state.scale, this.prevState.scale)) {
        callback({ scale: state.scale });
      }
    });
  }

  // Selectively subscribe to fps changes
  subscribeToFps(callback: (fps: { fps: State["fps"] }) => void) {
    return this.stateSubject.asObservable().subscribe((state) => {
      if (state.fps !== this.prevState.fps) {
        callback({ fps: state.fps });
      }
    });
  }

  subscribeToUpdateTrackItem(
    callback: (trackItemUpdate: {
      trackItemsMap: State["trackItemsMap"];
    }) => void
  ) {
    return this.stateSubject.asObservable().subscribe((state) => {
      if (!isEqual(state.trackItemsMap, this.prevState.trackItemsMap)) {
        callback({ trackItemsMap: state.trackItemsMap });
      }
    });
  }

  subscribeToUpdateAnimations(
    callback: (trackItemUpdate: {
      trackItemsMap: State["trackItemsMap"];
      changedAnimationIds?: string[];
    }) => void
  ) {
    return this.stateSubject.asObservable().subscribe((state) => {
      const changedAnimationIds = Object.keys(state.trackItemsMap).filter(
        (id) => {
          const prevItem = this.prevState.trackItemsMap[id];
          const currItem = state.trackItemsMap[id];
          return (
            prevItem &&
            currItem &&
            !isEqual(prevItem.animations, currItem.animations)
          );
        }
      );
      callback({ trackItemsMap: state.trackItemsMap, changedAnimationIds });
    });
  }

  subscribeToUpdateTrackItemTiming(
    callback: (trackItemUpdate: {
      trackItemsMap: State["trackItemsMap"];
      changedTrimIds?: string[];
      changedDisplayIds?: string[];
    }) => void
  ) {
    return this.stateSubject.asObservable().subscribe((state) => {
      if (!isEqual(state.trackItemsMap, this.prevState.trackItemsMap)) {
        // Check which items had trim changes
        const changedTrimIds = Object.keys(state.trackItemsMap).filter((id) => {
          const prevItem = this.prevState.trackItemsMap[id];
          const currentItem = state.trackItemsMap[id];
          return (
            prevItem && currentItem && !isEqual(prevItem.trim, currentItem.trim)
          );
        });

        // Check which items had display changes
        const changedDisplayIds = Object.keys(state.trackItemsMap).filter(
          (id) => {
            const prevItem = this.prevState.trackItemsMap[id];
            const currentItem = state.trackItemsMap[id];
            return (
              prevItem &&
              currentItem &&
              !isEqual(prevItem.display, currentItem.display)
            );
          }
        );
        callback({
          trackItemsMap: state.trackItemsMap,
          changedTrimIds:
            changedTrimIds.length > 0 ? changedTrimIds : undefined,
          changedDisplayIds:
            changedDisplayIds.length > 0 ? changedDisplayIds : undefined
        });
      }
    });
  }

  subscribeToUpdateItemDetails(
    callback: (trackItemUpdate: {
      trackItemsMap: State["trackItemsMap"];
    }) => void
  ) {
    return this.stateSubject.asObservable().subscribe((state) => {
      // Check if any trackItem.details has changed
      const hasDetailsChanged = Object.keys(state.trackItemsMap).some((id) => {
        const prevItem = this.prevState.trackItemsMap[id];
        const currItem = state.trackItemsMap[id];
        return (
          prevItem && currItem && !isEqual(prevItem.details, currItem.details)
        );
      });

      if (hasDetailsChanged) {
        callback({ trackItemsMap: state.trackItemsMap });
      }
    });
  }

  // Selectively subscribe to duration changes
  subscribeToDuration(
    callback: (duration: { duration: State["duration"] }) => void
  ) {
    return this.stateSubject.asObservable().subscribe((state) => {
      if (state.duration !== this.prevState.duration) {
        callback({ duration: state.duration });
      }
    });
  }

  subscribeToHistory(
    callback: (history: {
      tracks: State["tracks"];
      trackItemsMap: State["trackItemsMap"];
      trackItemIds: State["trackItemIds"];
      transitionIds: State["transitionIds"];
      transitionsMap: State["transitionsMap"];
      type: IKindHistory;
    }) => void
  ) {
    return this.stateHistorySubject.asObservable().subscribe((history) => {
      if (history.handleRedo) {
        const type = this.undos[this.undos.length - 1].type;
        callback({ ...this.getState(), type });
        this.stateHistorySubject.next({ handleRedo: false, handleUndo: false });
      }
      if (history.handleUndo) {
        const type = this.redos[this.redos.length - 1].type;
        callback({ ...this.getState(), type });
        this.stateHistorySubject.next({ handleRedo: false, handleUndo: false });
      }
    });
  }

  subscribeToAddOrRemoveItems(
    callback: (trackItemIds: { trackItemIds: State["trackItemIds"] }) => void
  ) {
    return this.stateSubject.asObservable().subscribe((state) => {
      const sortedCurrentIds = [...state.trackItemIds].sort();
      const sortedPrevIds = [...this.prevState.trackItemIds].sort();

      const sortedTransitionIds = [...state.transitionIds].sort();
      const sortedPrevTransitionIds = [...this.prevState.transitionIds].sort();
      if (
        !isEqual(sortedCurrentIds, sortedPrevIds) ||
        !isEqual(sortedTransitionIds, sortedPrevTransitionIds)
      ) {
        callback({ trackItemIds: state.trackItemIds });
      }
    });
  }

  // Selectively subscribe to activeIds changes
  subscribeToActiveIds(
    callback: (activeIds: { activeIds: State["activeIds"] }) => void
  ) {
    return this.stateSubject.asObservable().subscribe((state) => {
      if (!isEqual(state.activeIds, this.prevState.activeIds)) {
        callback({ activeIds: state.activeIds });
      }
    });
  }

  subscribeToTracks(
    callback: (tracksUpdate: {
      tracks: State["tracks"];
      changedTracks: string[];
    }) => void
  ) {
    return this.stateSubject.asObservable().subscribe((state) => {
      const currentTracks = state.tracks;
      const prevTracks = this.prevState.tracks;
      const idPrevTracks = prevTracks.map((t) => t.id);
      const changedTracks = currentTracks.filter(
        (t) => !idPrevTracks.includes(t.id)
      );
      if (changedTracks.length) {
        callback({
          tracks: state.tracks,
          changedTracks: changedTracks.map((t) => t.id)
        });
      }
    });
  }

  subscribeToUpdateTracks(
    callback: (tracksUpdate: {
      tracks: State["tracks"];
      duration: State["duration"];
      trackItemsMap: State["trackItemsMap"];
    }) => void
  ) {
    return this.stateSubject.asObservable().subscribe((state) => {
      if (!isEqual(state.tracks, this.prevState.tracks)) {
        callback({
          tracks: state.tracks,
          duration: state.duration,
          trackItemsMap: state.trackItemsMap
        });
      }
    });
  }

  // Selectively subscribe to multiple track-related properties
  subscribeToState(
    callback: (tracksInfo: {
      tracks: State["tracks"];
      trackItemIds: State["trackItemIds"];
      trackItemsMap: State["trackItemsMap"];
      transitionIds: State["transitionIds"];
      transitionsMap: State["transitionsMap"];
      structure: State["structure"];
    }) => void
  ) {
    return this.stateSubject.asObservable().subscribe((state) => {
      if (
        !isEqual(state.tracks, this.prevState.tracks) ||
        !isEqual(state.trackItemIds, this.prevState.trackItemIds) ||
        !isEqual(state.trackItemsMap, this.prevState.trackItemsMap) ||
        !isEqual(state.transitionIds, this.prevState.transitionIds) ||
        !isEqual(state.transitionsMap, this.prevState.transitionsMap) ||
        !isEqual(state.structure, this.prevState.structure)
      ) {
        callback({
          tracks: state.tracks,
          trackItemIds: state.trackItemIds,
          trackItemsMap: state.trackItemsMap,
          transitionIds: state.transitionIds,
          transitionsMap: state.transitionsMap,
          structure: state.structure
        });
      }
    });
  }

  public undo() {
    const lastUndo = this.undos.pop();
    const update = lastUndo?.undos;
    const type = lastUndo?.type;

    if (!update) return;
    if (!type) return;

    enablePatches();

    const {
      trackItemIds,
      tracks,
      transitionIds,
      transitionsMap,
      trackItemsMap,
      structure
    } = this.getState();

    const currentState = cloneDeep({
      trackItemIds,
      tracks,
      transitionIds,
      transitionsMap,
      trackItemsMap,
      structure
    });

    const patchsTracks: Patch[] = [];
    const patchsTransitionIds: Patch[] = [];
    const patchsTrackItemIds: Patch[] = [];
    const patchsTransitionsMap: Patch[] = [];
    const patchsTrackItemsMap: Patch[] = [];
    const patchsStructure: Patch[] = [];

    update.forEach((diff) => {
      let patch: Patch;
      const path = diff.path.slice(1);
      if (diff.type === "CREATE") {
        patch = {
          path: path,
          op: "remove",
          value: diff.value
        };
      } else if (diff.type === "CHANGE") {
        patch = {
          path: path,
          op: "replace",
          value: diff.oldValue
        };
      } else {
        patch = {
          path: path,
          op: "add",
          value: diff.oldValue
        };
      }
      if (diff.path.includes("trackItemIds")) {
        patchsTrackItemIds.push(patch);
      } else if (diff.path.includes("transitionIds")) {
        patchsTransitionIds.push(patch);
      } else if (diff.path.includes("trackItemsMap")) {
        patchsTrackItemsMap.push(patch);
      } else if (diff.path.includes("transitionsMap")) {
        patchsTransitionsMap.push(patch);
      } else if (diff.path.includes("tracks")) {
        patchsTracks.push(patch);
      } else if (diff.path.includes("structure")) {
        patchsStructure.push(patch);
      }
    });

    const newStateTracks = this.applyPatch(
      currentState.tracks,
      patchsTracks
    ) as ITrack[];

    const newStateTransitionIds = this.applyPatch(
      currentState.transitionIds,
      patchsTransitionIds
    );
    const newStateTrackItemIds = this.applyPatch(
      currentState.trackItemIds,
      patchsTrackItemIds
    );
    const newStateTransitionsMap = this.applyPatch(
      currentState.transitionsMap,
      patchsTransitionsMap
    );
    const newStateTrackItemsMap = this.applyPatch(
      currentState.trackItemsMap,
      patchsTrackItemsMap
    );

    const newStateStructure = this.applyPatch(
      currentState.structure,
      patchsStructure
    );

    const nextState = cloneDeep({
      tracks: newStateTracks,
      transitionIds: newStateTransitionIds,
      trackItemIds: newStateTrackItemIds,
      transitionsMap: newStateTransitionsMap,
      trackItemsMap: newStateTrackItemsMap,
      structure: newStateStructure
    });

    const prevState = cloneDeep(this.getState());
    const newState = { ...prevState, ...nextState };

    this.prevState = prevState;
    this.redos.push({ redos: update, type });
    const duration = getDuration(newState.trackItemsMap);
    this.stateSubject.next({ ...newState, duration });
    this.stateHistorySubject.next({ handleRedo: false, handleUndo: true });
    this.updateState(newState, { updateHistory: false });
  }

  public applyPatch(json: any, patches: Patch[]) {
    return patches.reverse().reduce((draft, patch) => {
      return produce(draft, (draftState: any) => {
        applyPatches(draftState, [patch]);
      });
    }, json);
  }

  public redo() {
    const lastRedo = this.redos.pop();
    const update = lastRedo?.redos;
    const type = lastRedo?.type;

    if (!update) return;
    if (!type) return;

    enablePatches();

    const {
      trackItemIds,
      tracks,
      transitionIds,
      transitionsMap,
      trackItemsMap,
      structure
    } = this.getState();

    const currentState = cloneDeep({
      trackItemIds,
      tracks,
      transitionIds,
      transitionsMap,
      trackItemsMap,
      structure
    });

    const patchsTracks: Patch[] = [];
    const patchsTransitionIds: Patch[] = [];
    const patchsTrackItemIds: Patch[] = [];
    const patchsTransitionsMap: Patch[] = [];
    const patchsTrackItemsMap: Patch[] = [];
    const patchsStructure: Patch[] = [];

    update.forEach((diff) => {
      let patch: Patch;
      const path = diff.path.slice(1);
      if (diff.type === "CREATE") {
        patch = {
          path: path,
          op: "add",
          value: diff.value
        };
      } else if (diff.type === "CHANGE") {
        patch = {
          path: path,
          op: "replace",
          value: diff.value
        };
      } else {
        patch = {
          path: path,
          op: "remove",
          value: diff.oldValue
        };
      }
      if (diff.path.includes("trackItemIds")) {
        patchsTrackItemIds.push(patch);
      } else if (diff.path.includes("transitionIds")) {
        patchsTransitionIds.push(patch);
      } else if (diff.path.includes("trackItemsMap")) {
        patchsTrackItemsMap.push(patch);
      } else if (diff.path.includes("transitionsMap")) {
        patchsTransitionsMap.push(patch);
      } else if (diff.path.includes("structure")) {
        patchsStructure.push(patch);
      } else {
        patchsTracks.push(patch);
      }
    });

    const newStateTracks = this.applyPatch(
      currentState.tracks,
      patchsTracks
    ) as ITrack[];
    const newStateTransitionIds = this.applyPatch(
      currentState.transitionIds,
      patchsTransitionIds
    );
    const newStateTrackItemIds = this.applyPatch(
      currentState.trackItemIds,
      patchsTrackItemIds
    );
    const newStateTransitionsMap = this.applyPatch(
      currentState.transitionsMap,
      patchsTransitionsMap
    );
    const newStateTrackItemsMap = this.applyPatch(
      currentState.trackItemsMap,
      patchsTrackItemsMap
    );
    const newStateStructure = this.applyPatch(
      currentState.structure,
      patchsStructure
    );

    const nextState = cloneDeep({
      tracks: newStateTracks,
      transitionIds: newStateTransitionIds,
      trackItemIds: newStateTrackItemIds,
      transitionsMap: newStateTransitionsMap,
      trackItemsMap: newStateTrackItemsMap,
      structure: newStateStructure
    });

    const prevState = cloneDeep(this.getState());
    const newState = { ...prevState, ...nextState };

    this.prevState = prevState;
    this.undos.push({ undos: update, type });
    const duration = getDuration(newState.trackItemsMap);
    this.stateSubject.next({ ...newState, duration });
    this.stateHistorySubject.next({ handleRedo: true, handleUndo: false });
    this.updateState(newState, { updateHistory: false });
  }

  public toJSON() {
    const {
      fps,
      tracks,
      size,
      trackItemIds,
      transitionsMap,
      trackItemsMap,
      transitionIds
    } = this.getState();
    return {
      fps,
      tracks,
      size,
      trackItemIds,
      transitionsMap,
      trackItemsMap,
      transitionIds
    };
  }
}

export default StateManager;
