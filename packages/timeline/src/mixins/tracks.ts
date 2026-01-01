import Timeline from "../timeline";
import { nanoid } from "nanoid";
import { Helper, Track } from "../objects";
import { classRegistry } from "fabric";
import { getHelperHeight } from "../utils/sizes";
import { ITrack, ITrackItem } from "@designcombo/types";

class TracksMixin {
  public findOrCreateTrack(
    this: Timeline,
    trackItemData: ITrackItem,
    { trackId, trackIndex }: { trackId?: string; trackIndex?: number }
  ): string {
    if (trackId) {
      const existingTrack = this.tracks.find((track) => track.id === trackId);
      if (existingTrack) {
        existingTrack.items.push(trackItemData.id);
        return trackId;
      }
    }

    const accepts = this.getItemAccepts(trackItemData.type);
    const newTrack: ITrack = {
      id: nanoid(),
      items: [trackItemData.id],
      type: trackItemData.type as "rect",
      accepts: accepts,
      magnetic: false,
      static: false,
      muted: false
    };

    if (trackIndex !== undefined) {
      this.tracks.splice(trackIndex, 0, newTrack);
    } else {
      this.tracks.push(newTrack);
    }

    this.renderTracks();
    return newTrack.id;
  }

  public removeTracks(this: Timeline) {
    const trackElements = this.getObjects("Track", "Helper");
    trackElements.forEach((track) => this.remove(track));
  }

  public renderTracks(this: Timeline) {
    this.filterEmptyTracks();
    this.removeTracks();
    const canvasWidth = this.width;

    const tracksWithHelpers = this.tracks
      .flatMap(
        (track) =>
          [
            track,
            {
              id: `helper-${track.id}`,
              type: "helper",
              items: [],
              accepts: []
            }
          ] as ITrack[]
      )
      .slice(0, -1);

    let verticalPosition = -970;
    const HelperClass =
      (classRegistry.getClass("Helper") as typeof Helper) || Helper;

    // Render top helper line
    const topHelper = new HelperClass({
      top: verticalPosition,
      selectable: false,
      evented: false,
      tScale: this.tScale,
      id: "helper-line-top",
      width: canvasWidth,
      kind: "top",
      height: 1000,
      metadata: {}
    });
    verticalPosition += getHelperHeight("top");
    this.insertAt(0, topHelper);

    // Render tracks and helpers
    tracksWithHelpers.forEach((trackData, index) => {
      if (trackData.type === "helper") {
        const helperHeight = getHelperHeight("center");
        const centerHelper = new HelperClass({
          id: trackData.id,
          top: verticalPosition,
          tScale: this.tScale,
          width: canvasWidth,
          height: helperHeight,
          metadata: {
            order: (index + 1) / 2
          },
          kind: "center"
        });
        verticalPosition += helperHeight;
        this.insertAt(0, centerHelper);
      } else {
        const trackHeight = this.getItemSize(trackData.type);
        const TrackClass =
          (classRegistry.getClass("Track") as typeof Track) || Track;
        const accepts = this.getItemAccepts(trackData.type);
        const track = new TrackClass({
          id: trackData.id,
          top: verticalPosition,
          left: 0,
          height: trackHeight,
          width: canvasWidth,
          tScale: this.tScale,
          accepts: accepts,
          items: trackData.items,
          magnetic: trackData.magnetic,
          static: trackData.static
        });
        verticalPosition += trackHeight;
        this.insertAt(0, track);
      }
    });

    // Render bottom helper line
    const bottomHelper = new HelperClass({
      id: "helper-line-bottom",
      top: verticalPosition,
      selectable: false,
      evented: false,
      tScale: this.tScale,
      width: canvasWidth,
      kind: "bottom",
      height: 1000,
      metadata: {}
    });
    this.insertAt(0, bottomHelper);
  }

  filterEmptyTracks(this: Timeline) {
    const seenIds = new Set<string>();
    this.tracks = this.tracks.filter((track) => {
      // Keep track if it has items or is static, and hasn't been seen before
      if ((track.items.length || track.static) && !seenIds.has(track.id)) {
        seenIds.add(track.id);
        return true;
      }
      return false;
    });
  }

  refreshTrackLayout(this: Timeline) {
    const totalWidth = this.bounding.width + this.spacing.right;
    this.getObjects("Track", "Helper").forEach((track) => {
      track.updateCoords(totalWidth);
      track.setCoords();
    });
  }

  adjustMagneticTrack(this: Timeline) {
    this.pauseEventListeners();

    const magneticTracks = this.tracks.filter((track) => track.magnetic);
    if (magneticTracks.length > 0) {
      magneticTracks.forEach((magneticTrack) => {
        const accepts = magneticTrack.accepts || [];
        const mediaItems = this.getObjects(...accepts)
          .filter((item) => magneticTrack.items.includes(item.id))
          .sort((a, b) => a.left - b.left);
        let currentPosition = 0;
        mediaItems.forEach((item) => {
          item.left = currentPosition;
          currentPosition += item.width;
        });
      });
    }

    this.resumeEventListeners();
  }
}

export default TracksMixin;
