import { ITransition } from "@designcombo/types";
import { Transition } from "../objects";
import Timeline from "../timeline";
import { timeMsToUnits } from "../utils";

class TransitionsMixin {
  public removeTransitions(this: Timeline) {
    const transitionItems = this.getObjects("Transition");
    this.remove(...transitionItems);
  }

  public renderTransitions(this: Timeline) {
    this.removeTransitions();
    this.transitionIds.forEach((id) => {
      const transitionData = this.transitionsMap[id];
      const fromItemId = transitionData.fromId;
      const totItemId = transitionData.toId;
      const trackItems = this.getObjects();
      const fromObjItem = trackItems.find((t) => t.id === fromItemId);
      const toObjItem = trackItems.find((t) => t.id === totItemId);

      if (!fromObjItem || !toObjItem) {
        return;
      }
      const size = timeMsToUnits(transitionData.duration, this.tScale);
      const position = fromObjItem.left + fromObjItem.width - size / 2;
      const height = fromObjItem.height;
      const transitionItem = new Transition({
        id: transitionData.id,
        left: position,
        top: fromObjItem.top,
        height,
        width: size,
        tScale: this.tScale,
        duration: transitionData.duration,
        fromId: fromObjItem.id,
        toId: toObjItem.id,
        kind: transitionData.kind
      });

      if (transitionData.kind === "none") {
        transitionItem.visible = false;
      }

      if (transitionItem) {
        this.add(transitionItem);
      }
    });
  }

  public updateTrackTransitionsItemCoords(this: Timeline) {
    this.pauseEventListeners();

    const transitionItems = this.getObjects("Transition");
    transitionItems.forEach((o) => {
      o.tScale = this.tScale;
      o.updateCoords();
      o.setCoords();
    });

    this.resumeEventListeners();
  }

  public alignTransitionsToTrack(this: Timeline, alignActiveObjects = true) {
    const activeObjIds = alignActiveObjects
      ? []
      : this.getActiveObjects().map((o) => o.id);
    this.transitionIds.forEach((id) => {
      const transitionItem = this.getObjects("Transition").find(
        (o) => o.id === id
      );

      if (transitionItem instanceof Transition) {
        const fromObject = this.getObjects().find(
          (o) => o.id === transitionItem.fromId && !activeObjIds.includes(o.id)
        );

        if (!fromObject) return;
        const size = timeMsToUnits(transitionItem.duration, this.tScale);
        const position = fromObject.left + fromObject.width - size / 2;
        transitionItem.set({
          left: position,
          top: fromObject.top
        });
        transitionItem.setCoords();
      }
    });
  }

  updateTransitions(this: Timeline, handleListeners = true) {
    handleListeners && this.pauseEventListeners();
    const tracks = this.getObjects("Track");
    const trackItems = this.getObjects(...this.withTransitions);

    this.removeTransitions();
    const transitionsMapNext: Record<string, ITransition> = {};
    const transitionIdsNext: string[] = [];

    tracks.forEach((track) => {
      const items = trackItems
        .filter((trackItem) => track.items.includes(trackItem.id))
        .sort((a, b) => a.left - b.left);

      for (let i = 0; i < items.length - 1; i++) {
        const item1 = items[i];
        const item2 = items[i + 1];

        // check if the items are adjacent
        if (Math.abs(item1.left + item1.width - item2.left) <= 1) {
          const nextTransitionId = `${item1.id}-${item2.id}`;
          const transitionExists =
            this.transitionIds.includes(nextTransitionId);
          if (transitionExists) {
            const transition = this.transitionsMap[nextTransitionId];

            transitionsMapNext[nextTransitionId] = transition;
          } else {
            const transition: ITransition = {
              id: nextTransitionId,
              duration: 1500,
              fromId: item1.id,
              toId: item2.id,
              kind: "none",
              trackId: track.id,
              type: "transition"
            };

            transitionsMapNext[nextTransitionId] = transition;
          }

          transitionIdsNext.push(nextTransitionId);
        }
      }
    });
    // compare to current transitions
    this.transitionIds = transitionIdsNext;
    this.transitionsMap = transitionsMapNext;
    this.renderTransitions();

    // update transitions in cache
    const newTransitions = this.getObjects("Transition");
    this.updateCachingActiveObjects(newTransitions);

    handleListeners && this.resumeEventListeners();
  }
}

export default TransitionsMixin;
