import { Control, Rect, RectProps, classRegistry } from "fabric";

import {
  ACTIVE_SELECTION_COLOR,
  ACTIVE_SELECTION_WIDTH
} from "../constants/objects";
import { createTransitionControls } from "../controls";

interface TransitionProps
  extends Pick<RectProps, "width" | "height" | "top" | "left"> {
  id: string;
  tScale: number;
  duration: number;
  fromId: string;
  toId: string;
  kind: string;
  strokeDashArray?: number[];
}

class Transition extends Rect {
  static type = "Transition";
  public duration: number;
  public fromId: string;
  public toId: string;
  public kind: string = "none";
  public isSelected = false;
  public availableDrop = true;

  static createControls(): { controls: Record<string, Control> } {
    return { controls: createTransitionControls() };
  }

  static getDefaults(): Record<string, any> {
    return {
      ...super.getDefaults(),
      ...Transition.ownDefaults
    };
  }

  static ownDefaults = {
    objectCaching: false,
    borderColor: "transparent",
    stroke: "transparent",
    strokeWidth: 1.5,
    fill: "rgba(0,0,0, 0.5)",
    borderOpacityWhenMoving: 1,
    hoverCursor: "default",
    lockMovementX: true,
    lockMovementY: true,
    duration: 1500,
    rx: 8,
    ry: 8
  };

  constructor(props: TransitionProps) {
    super(props);
    Object.assign(this, Transition.ownDefaults);
    this.id = props.id;
    this.centeredScaling = true;
    this.strokeWidth = 0;
    this.tScale = props.tScale;
    this.duration = props.duration;
    this.fromId = props.fromId;
    this.toId = props.toId;
    this.kind = props.kind;
    this.strokeDashArray = props.strokeDashArray || [];
  }

  public updateCoords() {}

  // add custom text to the track item
  public _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx);
    this.updateSelected(ctx);
  }

  public setSelected(selected: boolean) {
    this.isSelected = selected;
    this.set({ dirty: true });
  }

  public updateSelected(ctx: CanvasRenderingContext2D) {
    const strokeStyle = this.availableDrop
      ? this.isSelected
        ? ACTIVE_SELECTION_COLOR
        : "rgba(255, 255, 255,0.15)"
      : "red";

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height,
      this.rx
    );
    ctx.lineWidth = ACTIVE_SELECTION_WIDTH;
    ctx.setLineDash(this.strokeDashArray as any); // Set the dash pattern
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
    ctx.restore();
  }
}

classRegistry.setClass(Transition, "Transition");

export default Transition;
