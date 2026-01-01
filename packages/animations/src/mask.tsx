export const MaskAnim = ({
  children,
  frame,
  item,
  keyframeAnimations
}: {
  children: React.ReactNode;
  frame: number;
  item: any;
  keyframeAnimations: any;
}) => {
  const findMaskAnim = keyframeAnimations?.find((anim: any) =>
    anim.property.includes("maskReveal")
  );
  const currentWidth = item.details.crop?.width || item.details.width;
  const currentHeight = item.details.crop?.height || item.details.height;
  let progress = 1;
  let maskHeight = currentHeight;
  let maskX = 0;
  let maskY = 0;
  let maskWidth = currentWidth;

  if (
    (frame || 0) - item.display.from >= 0 &&
    findMaskAnim?.property === "maskRevealIn"
  ) {
    progress = Math.min((frame || 0) / findMaskAnim.durationInFrames, 1);
    maskHeight = currentHeight - currentHeight * (1 - progress);
  } else if (
    (frame || 0) - item.display.from >= 0 &&
    findMaskAnim?.property === "maskRevealCenterIn"
  ) {
    progress = Math.min((frame || 0) / findMaskAnim.durationInFrames, 1);
    const centerX = currentWidth / 2;
    const centerY = currentHeight / 2;
    maskWidth = currentWidth;
    maskHeight = currentHeight * progress;
    maskX = centerX - maskWidth / 2;
    maskY = centerY - maskHeight / 2;
  } else if (
    (frame || 0) - item.display.from >= 0 &&
    findMaskAnim?.property === "maskRevealCornerIn"
  ) {
    progress = Math.min((frame || 0) / findMaskAnim.durationInFrames, 1);

    maskWidth = currentWidth * progress;
    maskHeight = currentHeight * progress;
    maskX = currentWidth - maskWidth;
    maskY = 0;
  }

  return (
    <div
      style={{
        width: currentWidth,
        height: currentHeight,
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          position: "absolute",
          left: maskX,
          top: maskY,
          width: maskWidth,
          height: maskHeight,
          overflow: "hidden"
        }}
      >
        {children}
      </div>
    </div>
  );
};
