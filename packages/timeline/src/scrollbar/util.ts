import { type TMat2D, type TPointerEventInfo, util } from "fabric";
import Timeline from "../timeline";

type SizeProps = {
  min: number;
  max: number;
};

const getObjectsBoundingRect = (canvas: Timeline) => {
  const objects = canvas.getTrackItems();
  if (objects.length === 0) {
    return { left: 0, top: 0, right: 0, bottom: 0 };
  }

  const { left, top, width, height } = util.makeBoundingBoxFromPoints(
    objects.map((x) => x.getCoords()).flat(1)
  );
  return { left, top, right: left + width, bottom: top + height };
};

const limitViewport = (
  canvas: Timeline,
  vpt: TMat2D,
  offsetX = 0,
  offsetY = 0,
  extraMarginX = 200,
  extraMarginY = 200
): TMat2D => {
  const zoom = vpt[0];

  const objectRect = getObjectsBoundingRect(canvas);

  const totalAreaLeft = Math.min(objectRect.left, -offsetX);
  const totalAreaTop = Math.min(objectRect.top, -offsetY);
  const totalAreaRight = objectRect.right + extraMarginX;
  const totalAreaBottom = objectRect.bottom + extraMarginY;

  const totalWidth = totalAreaRight - totalAreaLeft;
  const totalHeight = totalAreaBottom - totalAreaTop;

  const canvasWidth = canvas.width / zoom;
  const canvasHeight = canvas.height / zoom;

  if (totalWidth <= canvasWidth) {
    vpt[4] = -totalAreaLeft * zoom;
  } else {
    const maxScrollLeft = offsetX * zoom;
    if (vpt[4] > maxScrollLeft) vpt[4] = maxScrollLeft;

    const minScrollRight = -(
      (objectRect.right + extraMarginX) * zoom -
      canvas.width
    );
    if (minScrollRight < 0 && vpt[4] < minScrollRight) {
      vpt[4] = minScrollRight;
    }
  }

  if (totalHeight <= canvasHeight) {
    vpt[5] = -totalAreaTop * zoom;
  } else {
    const maxScrollTop = offsetY * zoom;
    if (vpt[5] > maxScrollTop) vpt[5] = maxScrollTop;

    const minScrollBottom = -(
      (objectRect.bottom + extraMarginY) * zoom -
      canvas.height
    );
    if (minScrollBottom < 0 && vpt[5] < minScrollBottom) {
      vpt[5] = minScrollBottom;
    }
  }

  return vpt;
};

type MouseWheelOptions = {
  offsetX?: number;
  offsetY?: number;
  extraMarginX?: number;
  extraMarginY?: number;
} & Partial<SizeProps>;

export const makeMouseWheel =
  (canvas: Timeline, options: MouseWheelOptions = {}) =>
  (wheelEvent: TPointerEventInfo<WheelEvent>) => {
    const e = wheelEvent.e;
    if (e.target == canvas.upperCanvasEl) e.preventDefault();

    const isTouchScale = Math.floor(e.deltaY) != Math.ceil(e.deltaY);

    if (e.ctrlKey || e.metaKey) {
      const speed = isTouchScale ? 0.99 : 0.998;
      let zoom = canvas.getZoom();
      zoom *= speed ** e.deltaY;

      if (options.max != undefined && zoom > options.max) zoom = options.max;
      if (options.min != undefined && zoom < options.min) zoom = options.min;
      canvas.zoomToPoint(wheelEvent.viewportPoint, zoom);
      canvas.requestRenderAll();
      return;
    }

    const vpt = canvas.viewportTransform.slice(0) as TMat2D;

    if (e.shiftKey) {
      vpt[4] -= e.deltaY;
    } else {
      vpt[4] -= e.deltaX;
      vpt[5] -= e.deltaY;
    }

    const limitedVpt = limitViewport(
      canvas,
      vpt,
      options.offsetX ?? 0,
      options.offsetY ?? 0,
      options.extraMarginX ?? 200,
      options.extraMarginY ?? 200
    );
    canvas.setViewportTransform(limitedVpt);
    canvas.requestRenderAll();
  };
