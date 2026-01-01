import { State } from "@designcombo/types";
import { cloneDeep } from "lodash";
import { getDuration } from "../utils/duration";
import { transfString } from "../utils/load-illustration";
import { getImageInfo } from "../utils/media";
import { alignMagneticTracks } from "../utils/align-tracks";
import { nanoid } from "nanoid";
import { getAcceptsMap } from "../state-options";

export async function editObject(
  state: State,
  payload: Record<string, any>
): Promise<Partial<State>> {
  const currentState = cloneDeep(state);
  const trackItemsMap = currentState.trackItemsMap;
  const ids = Object.keys(payload);

  if (!ids.length) return {};

  // Process each item's updates
  for (const id of ids) {
    const itemPayload = payload[id];

    // Update details if provided
    if (itemPayload.details) {
      trackItemsMap[id].details = {
        ...trackItemsMap[id].details,
        ...itemPayload.details
      };

      // Handle color map updates for illustrations
      if (itemPayload.details.colorMap) {
        const defaultSVG = trackItemsMap[id].details.initialSvgString;
        const newSvgString = transfString(
          defaultSVG,
          itemPayload.details.colorMap
        );
        trackItemsMap[id].details.svgString = newSvgString;
      }
    }

    // Update metadata if provided
    if (itemPayload.metadata) {
      if (trackItemsMap[id].metadata) {
        trackItemsMap[id].metadata = {
          ...trackItemsMap[id].metadata,
          ...itemPayload.metadata
        };
      } else {
        trackItemsMap[id].metadata = itemPayload.metadata;
      }
    }

    // Update display and playback rate if provided
    if (itemPayload.display || itemPayload.playbackRate) {
      const nextPlaybackRate = itemPayload.playbackRate;
      const currentPlaybackRate = trackItemsMap[id].playbackRate || 1;
      const currentDisplay = trackItemsMap[id].display;
      const currentDuration = currentDisplay.to - currentDisplay.from;
      const plainDuration = currentDuration * currentPlaybackRate;
      const nextDuration = plainDuration / nextPlaybackRate;
      const nextDisplay = {
        from: currentDisplay.from,
        to: currentDisplay.from + nextDuration
      };

      trackItemsMap[id].display = nextDisplay;
      trackItemsMap[id].playbackRate = nextPlaybackRate;
    }

    if (itemPayload.animations) {
      trackItemsMap[id].animations = {
        ...trackItemsMap[id].animations,
        ...itemPayload.animations
      };
    }
  }

  // Handle shape source updates
  for (const id of ids) {
    const update = payload[id];
    if (trackItemsMap[id].type === "shape" && update.details.src) {
      const imageInfo = await getImageInfo(update.details.src);
      trackItemsMap[id].details.width = imageInfo.width;
      trackItemsMap[id].details.height = imageInfo.height;
    }
  }

  // Realign magnetic tracks if display or playbackRate was modified
  const hasDisplayOrPlaybackRateChange = ids.some((id) => {
    const itemPayload = payload[id];
    return (
      itemPayload.display !== undefined ||
      itemPayload.playbackRate !== undefined
    );
  });

  if (hasDisplayOrPlaybackRateChange) {
    const magneticTracks = currentState.tracks.filter((t) => t.magnetic);
    // Realign all items in magnetic tracks that contain modified items
    const modifiedIdsInMagneticTracks = ids.filter((id) => {
      return magneticTracks.some((track) => track.items.includes(id));
    });

    if (modifiedIdsInMagneticTracks.length > 0) {
      // Realign all items in affected magnetic tracks
      // Pass empty array to realign all items from the beginning
      alignMagneticTracks(magneticTracks, trackItemsMap, []);
    }

    // Handle non-magnetic tracks: check for overlaps when playbackRate increases
    // Also check and remove transitions when items are no longer connected
    const transitionsToRemove: string[] = [];

    for (const id of ids) {
      const itemPayload = payload[id];
      // Only process if playbackRate or display was changed
      if (
        itemPayload.playbackRate === undefined &&
        itemPayload.display === undefined
      )
        continue;

      const item = trackItemsMap[id];
      if (!item) continue;

      // Find the track containing this item
      const currentTrack = currentState.tracks.find((track) =>
        track.items.includes(id)
      );
      if (!currentTrack) continue;

      // Skip if track is magnetic
      if (currentTrack.magnetic) continue;

      const newDisplay = item.display;

      // Check transitions involving this item
      const transitionsToCheck = Object.values(
        currentState.transitionsMap
      ).filter(
        (transition) => transition.fromId === id || transition.toId === id
      );

      transitionsToCheck.forEach((transition) => {
        const fromItem = trackItemsMap[transition.fromId];
        const toItem = trackItemsMap[transition.toId];

        if (!fromItem || !toItem) {
          // If either item is missing, remove the transition
          transitionsToRemove.push(transition.id);
          return;
        }

        const fromDisplay = fromItem.display;
        const toDisplay = toItem.display;

        // Check if items are still connected (adjacent)
        // Items are connected if fromItem.display.to matches toItem.display.from (with small margin for floating point errors)
        const fromItemEnd = fromDisplay.to;
        const toItemStart = toDisplay.from;
        const isConnected = Math.abs(fromItemEnd - toItemStart) <= 1;

        // If items are no longer connected, remove the transition
        if (!isConnected) {
          transitionsToRemove.push(transition.id);
        }
      });

      // Check if the new display overlaps with items to the right
      const itemsInTrack = currentTrack.items
        .map((itemId) => trackItemsMap[itemId])
        .filter((trackItem) => trackItem && trackItem.id !== id);

      // Check for overlaps with items to the right (items that start after or at the same time)
      const hasOverlap = itemsInTrack.some((otherItem) => {
        const otherFrom = otherItem.display.from;
        const otherTo = otherItem.display.to;
        const newFrom = newDisplay.from;
        const newTo = newDisplay.to;

        // Check if items overlap (not completely separate)
        return !(newTo <= otherFrom || newFrom >= otherTo);
      });

      // If there's overlap, create a new track and move the item
      if (hasOverlap) {
        // Find the index of the current track
        const currentTrackIndex = currentState.tracks.findIndex(
          (track) => track.id === currentTrack.id
        );

        // Remove item from current track
        currentTrack.items = currentTrack.items.filter(
          (itemId) => itemId !== id
        );

        // Create new track
        const newTrack = {
          id: nanoid(),
          accepts: Object.keys(getAcceptsMap()),
          type: item.type as any,
          items: [id],
          magnetic: false,
          static: false,
          muted: false
        };

        // Insert new track at position -1 (one position before current track)
        const newTrackIndex = Math.max(0, currentTrackIndex - 1);
        currentState.tracks.splice(newTrackIndex, 0, newTrack);
      }
    }

    // Remove transitions that are no longer valid
    if (transitionsToRemove.length > 0) {
      // Remove from transitionIds
      currentState.transitionIds = currentState.transitionIds.filter(
        (transitionId) => !transitionsToRemove.includes(transitionId)
      );

      // Remove from transitionsMap
      transitionsToRemove.forEach((transitionId) => {
        delete currentState.transitionsMap[transitionId];
      });
    }
  }

  const duration = getDuration(trackItemsMap);
  return {
    trackItemsMap: { ...trackItemsMap },
    tracks: currentState.tracks,
    transitionIds: currentState.transitionIds,
    transitionsMap: currentState.transitionsMap,
    duration
  };
}
