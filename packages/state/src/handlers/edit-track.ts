import { State } from "@designcombo/types";
import { cloneDeep } from "lodash";
import { alignMagneticTracks } from "../utils/align-tracks";
import { getDuration } from "../utils/duration";
// "oFzbZWEjlenCDN0S";
export async function editTrack(
  state: State,
  payload: Record<string, any>
): Promise<Partial<State>> {
  const currentState = cloneDeep(state);
  const tracks = currentState.tracks;
  const ids = Object.keys(payload);

  if (!ids.length) return currentState;

  for (const id of ids) {
    currentState.tracks = tracks.map((track) => {
      if (track.id === id) {
        const payloadData = payload[id] || {};
        track = {
          ...track,
          magnetic:
            payloadData.magnetic !== undefined
              ? payloadData.magnetic
              : track.magnetic,
          muted:
            payloadData.muted !== undefined ? payloadData.muted : track.muted
        };
      }
      return track;
    });
  }

  if (currentState.tracks.some((t) => t.magnetic)) {
    const magneticTracks = currentState.tracks.filter((t) => t.magnetic);
    alignMagneticTracks(magneticTracks, currentState.trackItemsMap, []);
  }

  const duration = getDuration(currentState.trackItemsMap);
  return {
    ...currentState,
    duration: duration
  };
}
