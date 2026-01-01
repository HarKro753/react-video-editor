import { ITrack } from "@designcombo/types";

// Function to remove specified items from the tracks array
export function removeItemsFromTrack(
  tracks: ITrack[],
  itemsToRemove: string[]
): ITrack[] {
  const filterTracks = tracks.filter((track) => {
    itemsToRemove.forEach((id) => {
      if (track.items.includes(id)) {
        track.items = track.items.filter((item) => item !== id);
      }
    });
    if (track.items.length !== 0 || track.static) {
      return track;
    }
  });
  return filterTracks;
}
