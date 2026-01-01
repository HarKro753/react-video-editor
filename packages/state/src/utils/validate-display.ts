import { ITrackItem, State } from "@designcombo/types";

export function validateDisplay(
  trackItems: ITrackItem[],
  { idTrack, idItems }: { idTrack: string; idItems: string[] },
  state: State
) {
  const track = state.tracks.find((track) => track.id === idTrack);
  if (!track || !track.magnetic) return;
  const findLastItem = track.items.reduce(
    (acc, id) => {
      const item = state.trackItemsMap[id];
      if (item.display.to > acc.display.to) {
        return item;
      }
      return acc;
    },
    { display: { to: 0 } }
  );
  let newTo = findLastItem.display.to;
  idItems.forEach((id) => {
    const item = trackItems.find((item) => String(item.id) === String(id));
    if (!item) return;
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

    item.display.from = newTo;
    item.display.to = newTo + duration;
    newTo = newTo + duration;
  });
}
