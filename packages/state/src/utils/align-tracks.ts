import { ITrack, ITrackItem } from "@designcombo/types";

export function alignMagneticTracks(
  magneticTracks: ITrack[],
  updateTrackItemsMap: Record<string, ITrackItem>,
  newIds: string[]
) {
  magneticTracks.forEach((magneticTrack) => {
    const itemsIdsInString = magneticTrack.items.map((item) => String(item));
    const filterTrackItems = Object.values(updateTrackItemsMap).filter((item) =>
      itemsIdsInString.includes(String(item.id))
    );
    const itemWithouthNewIds = filterTrackItems.filter(
      (item) => !newIds.includes(String(item.id))
    );
    const sortedItemNoNewsByFrom = itemWithouthNewIds.sort(
      (a, b) => a.display.from - b.display.from
    );
    const sortedFilterItemsByFrom = filterTrackItems.sort(
      (a, b) => a.display.from - b.display.from
    );
    const lastItem = sortedItemNoNewsByFrom[sortedItemNoNewsByFrom.length - 1];
    let increaseTime = lastItem?.display.to || 0;
    sortedFilterItemsByFrom.forEach((item) => {
      if (newIds.includes(String(item.id))) {
        // Calculate duration considering playbackRate for video and audio items
        // For video/audio items, the display duration should account for playbackRate
        // If the item has trim, calculate the real content duration and adjust by playbackRate
        const playbackRate = item.playbackRate || 1;
        let duration: number;

        if ((item.type === "video" || item.type === "audio") && item.trim) {
          // Calculate real content duration from trim
          const trimDuration = item.trim.to - item.trim.from;
          // Adjust by playbackRate: faster playback = shorter display duration
          duration = trimDuration / playbackRate;
        } else {
          // For other items or items without trim, use display duration directly
          // (it should already be adjusted by playbackRate if applicable)
          duration = item.display.to - item.display.from;
        }

        item.display = {
          from: increaseTime,
          to: increaseTime + duration
        };
        increaseTime = increaseTime + duration;
      }
    });
    const sortedItemByFrom = filterTrackItems.sort(
      (a, b) => a.display.from - b.display.from
    );
    const sortedItemIds = sortedItemByFrom.map((item) => String(item.id));

    let initialPosition = 0;
    sortedItemIds.forEach((itemId) => {
      const filterGroup: any[][] = [];

      let factorTransition = 0;

      filterGroup.forEach((group) => {
        group.forEach((item) => {
          if (item.type === "transition") {
            factorTransition += item.duration;
          }
        });
      });

      if (updateTrackItemsMap[String(itemId)]) {
        const item = updateTrackItemsMap[String(itemId)];
        // Calculate duration considering playbackRate for video and audio items
        // For video/audio items, the display duration should account for playbackRate
        // If the item has trim, calculate the real content duration and adjust by playbackRate
        const playbackRate = item.playbackRate || 1;
        let newTo: number;

        if ((item.type === "video" || item.type === "audio") && item.trim) {
          // Calculate real content duration from trim
          const trimDuration = item.trim.to - item.trim.from;
          // Adjust by playbackRate: faster playback = shorter display duration
          newTo = trimDuration / playbackRate;
        } else {
          // For other items or items without trim, use display duration directly
          // (it should already be adjusted by playbackRate if applicable)
          newTo = item.display.to - item.display.from;
        }

        updateTrackItemsMap[String(itemId)].display = {
          from: initialPosition - factorTransition,
          to: initialPosition + newTo - factorTransition
        };
        initialPosition += newTo;
      }
    });
  });
}
