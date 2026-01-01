import { Track } from "../../objects";
import Timeline from "../../timeline";
import { timeMsToUnits } from "../../utils";
import { getState } from "./internal";

const handleMovingEvent = () => {
  const state = getState();
  const canvas = state.canvas! as Timeline;
  const targetTrack = state.draggingOverTrack!;
  canvas.updateTrackItemCoords(true);
  const isMagnetic = targetTrack?.magnetic;

  const activeObjectIds = new Set(state.activeObjects.map((obj) => obj.id));
  if (isMagnetic) {
    const itemsMapKey = targetTrack.id;
    const trackObjects = state.trackToItemsMap[itemsMapKey];
    const sortedTrackObjects = trackObjects.sort((a, b) => a.left - b.left);
    const placeholders = state.placeholderMovingObjects;
    const placeholderTop = placeholders[0]?.top || 0;
    const totalPlaceholderWidth = placeholders.reduce(
      (total, obj) => total + obj.width,
      0
    );
    const minPlaceholderLeft = Math.min(...placeholders.map((obj) => obj.left));
    let currentLeftPosition = 0;
    sortedTrackObjects.forEach((object) => {
      if (activeObjectIds.has(object.id)) return;
      if (object.top !== placeholderTop) return;
      if (Math.abs(minPlaceholderLeft - currentLeftPosition) < 1) {
        currentLeftPosition += totalPlaceholderWidth;
      }
      object.left = currentLeftPosition;
      currentLeftPosition += object.width;
    });
  } else {
    if (targetTrack instanceof Track && state.orderNormalTrack) {
      const itemsIdsInTrack = targetTrack.items;
      const objectsInTrack = canvas
        .getTrackItems()
        .filter(
          (o) => !activeObjectIds.has(o.id) && itemsIdsInTrack.includes(o.id)
        );
      const sortObjectInTrack = objectsInTrack.sort((a, b) => a.left - b.left);
      const firstPlaceholderObj = state.placeholderMovingObjects[0];
      const lastPlaceholderObj =
        state.placeholderMovingObjects[
          state.placeholderMovingObjects.length - 1
        ];
      const placeholderLeft = firstPlaceholderObj.left;
      const placeholderWidth =
        lastPlaceholderObj.left -
        firstPlaceholderObj.left +
        lastPlaceholderObj.width;
      const nextObj = sortObjectInTrack.find((obj, index) => {
        if (obj.left >= placeholderLeft - 1) return sortObjectInTrack[index];
      })!;
      const filterRightObj = objectsInTrack.filter(
        (o) => o.left >= placeholderLeft - 1
      );

      if (firstPlaceholderObj.left + placeholderWidth > nextObj?.left) {
        const diffBetweenObjs =
          placeholderWidth - (nextObj.left - firstPlaceholderObj.left);
        filterRightObj.forEach((o) => {
          const currentLeft = timeMsToUnits(o.display.from, canvas.tScale);
          o.left = currentLeft + diffBetweenObjs;
        });
      }
    }
  }
  canvas.alignTransitionsToTrack(false);
};

export function addMovingEvents(timeline: Timeline) {
  timeline.on("object:moving", handleMovingEvent);
}

export function removeMovingEvents(timeline: Timeline) {
  timeline.off("object:moving", handleMovingEvent);
}
