import { ITrackItemAndDetails } from "@designcombo/types";
import Timeline from "../../timeline";
import { getDuration, timeMsToUnits } from "../../utils";

let selectionSubscription: any;
let addOrRemoveSubscription: any;
let historySubscription: any;
let updateTrackItemsDetailsSubscription: any;
let scaleSubscription: any;
let updateTrackItemTimingSubscription: any;
let updateTrackItemAnimationsSubscription: any;
let updateTracks: any;
let updateTracksSubscription: any;

export const addStateEvents = (timeline: Timeline) => {
  selectionSubscription = timeline.state.subscribeToActiveIds(
    ({ activeIds }) => {
      const timelineActiveIds = timeline.activeIds;
      if (activeIds.length === 1 && timelineActiveIds.length === 1) {
        const activeId = activeIds[0];
        const timelineActiveId = timelineActiveIds[0];
        const currentState = timeline.state.getState();
        const structure = currentState.structure;
        let templateId: string = "";
        structure.forEach((s) => {
          if (s.id === timelineActiveId) {
            const items = s.items!;
            if (items.includes(activeId)) templateId = s.id;
          }
        });
        if (templateId !== "") return;
        timeline.selectTrackItemByIds([activeId]);
      } else {
        timeline.selectTrackItemByIds(activeIds);
      }
    }
  );

  updateTracksSubscription = timeline.state.subscribeToUpdateTracks(
    ({ tracks, duration, trackItemsMap }) => {
      timeline.tracks = tracks;
      timeline.duration = duration;
      timeline.trackItemsMap = trackItemsMap;
      timeline.synchronizeTrackItemsState();
      timeline.renderTracks();
      timeline.refreshTrackLayout();
      timeline.adjustMagneticTrack();
      timeline.renderTransitions();
      timeline.alignItemsToTrack();
      timeline.alignTransitionsToTrack();
      timeline.calcBounding();
    }
  );

  // timeline.adjustMagneticTrack();
  // timeline.renderTransitions();
  // timeline.alignItemsToTrack();
  // timeline.alignTransitionsToTrack();
  // timeline.calcBounding();

  updateTracks = timeline.state.subscribeToTracks(
    ({ tracks, changedTracks }) => {
      if (changedTracks.length) {
        timeline.tracks = tracks;
        timeline.renderTracks();
        timeline.refreshTrackLayout();
      }
    }
  );

  updateTrackItemAnimationsSubscription =
    timeline.state.subscribeToUpdateAnimations(
      ({ trackItemsMap, changedAnimationIds }) => {
        if (changedAnimationIds?.length) {
          const items = timeline.getTrackItems();
          timeline.trackItemsMap = trackItemsMap;
          items.forEach((item) => {
            if (changedAnimationIds.includes(item.id)) {
              const itemAnimations = trackItemsMap[item.id].animations;
              if (itemAnimations) {
                item.set({
                  animations: itemAnimations
                });
              }
            }
          });
        }
      }
    );

  updateTrackItemTimingSubscription =
    timeline.state.subscribeToUpdateTrackItemTiming(
      ({ trackItemsMap, changedTrimIds, changedDisplayIds }) => {
        if (changedTrimIds) {
          const items = timeline.getTrackItems();
          items.forEach((item) => {
            if (changedTrimIds.includes(item.id)) {
              const itemTrim = trackItemsMap[item.id].trim;
              if (itemTrim) {
                item.set({
                  trim: {
                    from: itemTrim.from,
                    to: itemTrim.to
                  }
                });
              }
            }
          });
        }
        if (changedDisplayIds) {
          const items = timeline.getTrackItems();
          timeline.pauseEventListeners();
          items.forEach((item) => {
            if (changedDisplayIds.includes(item.id)) {
              const itemDisplay = trackItemsMap[item.id].display;
              timeline.trackItemsMap[item.id].display = itemDisplay;
              if (
                trackItemsMap[item.id].playbackRate !==
                timeline.trackItemsMap[item.id].playbackRate
              ) {
                timeline.trackItemsMap[item.id].playbackRate =
                  trackItemsMap[item.id].playbackRate;
                item.playbackRate = trackItemsMap[item.id].playbackRate;
                item.onScale && item.onScale();
              }
              if (itemDisplay) {
                item.set({
                  display: itemDisplay
                });
              }
            }
          });

          timeline.resumeEventListeners();
        }
        timeline.updateTrackItemCoords();
        timeline.adjustMagneticTrack();
        timeline.updateTransitions();
        timeline.alignItemsToTrack();
        timeline.renderTracks();
        timeline.calcBounding();
        timeline.refreshTrackLayout();
        timeline.setTrackItemCoords();
        timeline.requestRenderAll();
      }
    );

  scaleSubscription = timeline.state.subscribeToScale((data) => {
    timeline.setScale(data.scale);
  });

  updateTrackItemsDetailsSubscription =
    timeline.state.subscribeToUpdateItemDetails((data) => {
      const items = timeline.getTrackItems();
      if (items.length === 0) return;
      const state = timeline.state.getState();
      const updatedTrackItemsMap = data.trackItemsMap;
      const trackItemsMap = state.trackItemsMap;
      timeline.trackItemsMap = updatedTrackItemsMap;
      items.forEach((item) => {
        const itemDetail = updatedTrackItemsMap[item.id];
        if (!itemDetail) return;
        if (item.hasSrc) {
          const itemMap = trackItemsMap[item.id];
          const currentSrc = item.src;
          if (currentSrc !== itemDetail.details.src && item.setSrc) {
            item.setSrc(itemDetail.details.src);
          }
          if (itemDetail.type === "video" || itemDetail.type === "audio") {
            const newWidthInTime =
              (itemMap.trim?.to || 0) - (itemMap.trim?.from || 0);
            const newWidthInUnits = timeMsToUnits(
              newWidthInTime,
              timeline.scale.zoom,
              itemMap.playbackRate
            );
            item.set({
              duration: itemMap.duration,
              display: itemMap.display,
              trim: itemMap.trim,
              width: newWidthInUnits
            });
            item.setCoords();
          }
        } else if (
          itemDetail.type === "text" ||
          itemDetail.type === "caption"
        ) {
          if (itemDetail.type === "text" || itemDetail.type === "caption")
            item.set({ text: itemDetail.details.text });
        }
      });
      timeline.requestRenderAll();
    });

  historySubscription = timeline.state.subscribeToHistory((data) => {
    timeline.tracks = data.tracks;
    timeline.trackItemsMap = data.trackItemsMap;
    timeline.trackItemIds = data.trackItemIds;

    timeline.transitionIds = data.transitionIds;
    timeline.transitionsMap = data.transitionsMap;

    timeline.renderTracks();
    timeline.refreshTrackLayout();

    timeline.updateTrackItemCoords();

    timeline.alignItemsToTrack();

    timeline.alignTransitionsToTrack();

    timeline.adjustMagneticTrack();
    timeline.updateTransitions();
    timeline.calcBounding();
    timeline.duration = getDuration(timeline.trackItemsMap);
  });

  addOrRemoveSubscription = timeline.state.subscribeToAddOrRemoveItems(() => {
    const trackItemIdsInCanvas = timeline.getTrackItems().map((o) => o.id);

    const currentState = timeline.state.getState();

    const desiredTrackItemIds = currentState.trackItemIds;
    const deleteIds: string[] = [];
    // handle remove
    trackItemIdsInCanvas.forEach((id) => {
      if (!desiredTrackItemIds.includes(id)) {
        // remove from canvas
        deleteIds.push(id);
      }
    });

    timeline.deleteTrackItemById(deleteIds);
    timeline.tracks = currentState.tracks;
    timeline.trackItemsMap = currentState.trackItemsMap;
    timeline.transitionIds = currentState.transitionIds;
    timeline.transitionsMap = currentState.transitionsMap;

    desiredTrackItemIds.forEach((id) => {
      if (!trackItemIdsInCanvas.includes(id)) {
        const trackItemData = currentState.trackItemsMap[id];

        const trackItem = {
          ...trackItemData
        } as ITrackItemAndDetails;
        timeline.addTrackItem(trackItem);
      }
    });
    timeline.trackItemIds = currentState.trackItemIds;
    timeline.activeIds = currentState.activeIds;

    timeline.renderTracks();
    timeline.alignItemsToTrack();
    timeline.updateTrackItemCoords();
    timeline.calcBounding();
    timeline.updateTransitions();

    timeline.refreshTrackLayout();
    timeline.selectTrackItemByIds(currentState.activeIds);
  });
};

export const removeStateEvents = (_: Timeline) => {
  selectionSubscription.unsubscribe();
  addOrRemoveSubscription.unsubscribe();
  historySubscription.unsubscribe();
  updateTrackItemsDetailsSubscription.unsubscribe();
  scaleSubscription.unsubscribe();
  updateTrackItemTimingSubscription.unsubscribe();
  updateTrackItemAnimationsSubscription.unsubscribe();
  updateTracks.unsubscribe();
  updateTracksSubscription.unsubscribe();
};
