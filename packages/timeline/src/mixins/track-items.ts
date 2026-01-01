import { ActiveSelection, FabricObject } from "fabric";
import Timeline from "../timeline";
import { Transition, Trimmable } from "../objects";
import { unitsToTimeMs } from "../utils/timeline";
import { ITrackItem, ITrackItemAndDetails } from "@designcombo/types";
import { removeItemsFromTrack } from "../utils/item";
import { timeMsToUnits } from "../utils";
import { loadObject } from "../utils/load-object";
import { isEqual } from "lodash-es";

class TrackItemsMixin {
  public addTrackItem(this: Timeline, trackItem: ITrackItemAndDetails) {
    const object = loadObject(trackItem, {
      tScale: this.tScale,
      sizesMap: this.sizesMap
    });

    this.add(object as FabricObject);
  }

  public alignItemsToTrack(this: Timeline) {
    this.pauseEventListeners();

    // Create a map of track IDs to track objects
    const trackMap = new Map(
      this.getObjects("Track").map((track) => [track.id, track])
    );

    // Cache track items for later use
    const trackItems = this.getTrackItems();
    const transitions = this.getObjects("Transition") as Transition[];

    // Align track items to their respective tracks
    this.trackItemIds.forEach((id) => {
      const currentTrackData = this.tracks.find((track) =>
        track.items.includes(id)
      );
      if (!currentTrackData) return; // Handle case where track data is not found

      const track = trackMap.get(currentTrackData.id);
      const trackItem = this.getTrackItems().find((o) => o.id === id);
      if (trackItem && track) {
        trackItem.isMain = track.magnetic;
        this.trackItemsMap[id]!.isMain = track.magnetic;
        trackItem.set({ top: track.top });
        trackItem.setCoords();
      }
    });

    // Update track items IDs
    trackMap.forEach((track) => {
      track.items = trackItems
        .filter((trackItem) => trackItem.top === track.top)
        .map((trackItem) => {
          return trackItem.id;
        });
    });

    transitions.forEach((transition) => {
      const fromId = transition.fromId;
      const fromObject = trackItems.find((o) => o.id === fromId);
      if (fromObject) {
        transition.set({ top: fromObject.top });
        transition.setCoords();
      }
    });

    this.resumeEventListeners();
  }

  public updateTrackItemsToHistory(this: Timeline) {
    this.pauseEventListeners();
    this.trackItemIds.forEach((id) => {
      const currentTrack = this.tracks.find((t) => t.items.includes(id));
      const top = this.getObjects().find((o) => o.id === currentTrack?.id)!.top;
      const trackItem = this.trackItemsMap[id];
      const trackItemObject = this.getObjects().find((o) => o.id === id)!;
      const left = timeMsToUnits(trackItem.display.from, this.tScale);
      const width = timeMsToUnits(
        trackItem.display.to - trackItem.display.from,
        this.tScale,
        trackItem.playbackRate
      );

      trackItemObject.set({ left, width, top });

      if (trackItemObject instanceof Trimmable) {
        const duration =
          trackItemObject.display.to - trackItemObject.display.from;
        if (trackItemObject.setDuration) {
          trackItemObject.setDuration(duration);
        } else {
          trackItemObject.set({ duration });
        }
        trackItem.trim = trackItemObject.trim;
        trackItem.display = trackItemObject.display;
      }
      trackItemObject.setCoords();
    });
    this.requestRenderAll();
    this.resumeEventListeners();
  }

  public deleteTrackItemToHistory(this: Timeline, ids: string[]) {
    this.getObjects()
      .filter((obj) => ids.includes(obj.id))
      .map((obj) => this.remove(obj));
    this.alignItemsToTrack();
    this.requestRenderAll();
  }

  public uodateTrackItemIdsOrdering(this: Timeline) {
    const trackItems = this.getTrackItems();

    trackItems.sort((a, b) => a.top - b.top);
    this.trackItemIds = trackItems.map((t) => t.id).reverse();
  }

  public selectTrackItemByIds(this: Timeline, trackItemIds: string[]) {
    const currentActiveIds = this.getActiveObjects().map((o) => o.id);
    if (isEqual(currentActiveIds, trackItemIds)) return;
    const objects = this.getObjects(...Timeline.objectTypes, "Transition");

    const activeObjects = objects.filter((o) => trackItemIds.includes(o.id));

    if (!activeObjects.length) {
      this.discardActiveObject();
    } else if (activeObjects.length === 1) {
      this.setActiveObject(activeObjects[0]);
    } else {
      const activeSelection = new ActiveSelection(activeObjects);
      this.setActiveObject(activeSelection);
    }
    this.requestRenderAll();
  }

  public synchronizeTrackItemsState(this: Timeline) {
    this.pauseEventListeners();

    const trackItems = this.getTrackItems();
    const nextTrackItemsMap: Record<string, any> = {};

    trackItems.forEach((o) => {
      const { id, left, width } = o;
      const currentTrackItem = this.trackItemsMap[id];

      const from = unitsToTimeMs(left, this.tScale);

      const nextDuration = unitsToTimeMs(width, this.tScale);
      const nextDisplay = {
        from: from,
        to: from + nextDuration
      };

      const nextTrackItem: Partial<ITrackItem> = {
        display: nextDisplay
      };

      if (o instanceof Trimmable) {
        nextTrackItem.trim = o.trim;
      }

      o.display = nextDisplay;

      nextTrackItemsMap[id] = {
        ...currentTrackItem,
        ...nextTrackItem
      };
    });

    this.trackItemsMap = {
      ...this.trackItemsMap,
      ...nextTrackItemsMap
    };

    this.resumeEventListeners();
  }

  public deleteTrackItemById(this: Timeline, ids: string[]) {
    const activeIds = ids;
    const object = this.getObjects().filter((o) =>
      ids.includes(o.id)
    ) as FabricObject[];
    const updatedTracks = removeItemsFromTrack(this.tracks, activeIds);
    const updatedtrackItems: Record<string, any> = {};
    Object.keys(this.trackItemsMap).forEach((id) => {
      if (activeIds.includes(id)) {
        return;
      }
      updatedtrackItems[id] = this.trackItemsMap[id];
    });

    const updatedTrackItemIds = this.trackItemIds.filter(
      (id) => !activeIds.includes(id)
    );

    this.tracks = updatedTracks;
    this.trackItemsMap = updatedtrackItems;
    this.trackItemIds = updatedTrackItemIds;
    this.discardActiveObject();
    this.remove(...object);

    this.renderTracks();
    this.alignItemsToTrack();
  }

  public deleteActiveTrackItem(this: Timeline) {
    const activeObjects = this.getActiveObjects();
    if (!activeObjects.length) return false;
    const activeIds = activeObjects.map((obj) => obj.id);
    const updatedTracks = removeItemsFromTrack(this.tracks, activeIds);
    const updatedtrackItems: Record<string, any> = {};
    Object.keys(this.trackItemsMap).forEach((id) => {
      if (activeIds.includes(id)) {
        return;
      }
      updatedtrackItems[id] = this.trackItemsMap[id];
    });

    const updatedTrackItemIds = this.trackItemIds.filter(
      (id) => !activeIds.includes(id)
    );

    this.tracks = updatedTracks;
    this.trackItemsMap = updatedtrackItems;
    this.trackItemIds = updatedTrackItemIds;
    this.discardActiveObject();
    this.remove(...activeObjects);
    this.setActiveIds([]);

    this.renderTracks();
    this.alignItemsToTrack();
    this.updateState({ updateHistory: true, kind: "remove" });
  }

  /*
   * This method updates the coordinates of all track items in the timeline.
   */
  public updateTrackItemCoords(this: Timeline, updateActiveObject?: boolean) {
    const activeObjectIds = updateActiveObject
      ? this.getActiveObjects().map((o) => o.id)
      : [];
    !updateActiveObject && this.pauseEventListeners();
    this.trackItemIds.forEach((id) => {
      if (activeObjectIds.includes(id)) return;

      const trackItemObject = this.getObjects().find((o) => o.id === id)!;
      const item = this.trackItemsMap[id];

      const left = timeMsToUnits(item.display!.from, this.tScale);

      const width = timeMsToUnits(
        item.display!.to - item.display!.from,
        this.tScale
      );
      trackItemObject.set({
        left: left,
        width: width
      });
      trackItemObject.setCoords();
      return;
    });
    !updateActiveObject && this.resumeEventListeners();
  }

  public getTrackItems(this: Timeline) {
    return this.getObjects(...Timeline.objectTypes);
  }
  public setTrackItemCoords(this: Timeline) {
    this.getTrackItems().forEach((trackItem) => {
      trackItem.setCoords();
    });
  }

  public setActiveTrackItemCoords(this: Timeline) {
    const activeObjects = this.getActiveObjects();
    activeObjects.forEach((o) => o.setCoords());
  }
}

export default TrackItemsMixin;
