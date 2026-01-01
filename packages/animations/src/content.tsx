import React from "react";
import { combineAnimations, useAnimation } from "./use-animation";
import { Animation } from "./Animated";

export interface ContentAnimationsProps {
  animationTimed?: Animation | Animation[] | null;
  durationInFrames: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  frame: number;
}

export const ContentAnim: React.FC<ContentAnimationsProps> = ({
  animationTimed,
  durationInFrames,
  children,
  style = {},
  frame
}) => {
  // Handle timed animations here - these ARE affected by rotation
  const timedStyle = useAnimation(
    combineAnimations(animationTimed!),
    durationInFrames,
    frame,
    false,
    true
  );
  // Extract rotation from item.details.transform
  const transformStyle = style?.transform || "";
  const match = transformStyle.match(/rotate\((-?[\d.]+)deg\)/);
  const rotationValue = match ? parseFloat(match[1]) : 0;
  const resetRotationValue = -rotationValue;

  const combinedStyle = React.useMemo(() => {
    const result = {
      ...timedStyle
    } as { [key: string]: any };
    return result as React.CSSProperties;
  }, [timedStyle]);

  // Handle rotation for timed animations
  if (combinedStyle.transform?.includes("rotate")) {
    const currentTransform = combinedStyle.transform;
    combinedStyle.transform = currentTransform.replace(
      /rotate\(([^)]+)deg\)/,
      (_, value) => {
        let newRotate = parseFloat(value) - resetRotationValue;
        return `rotate(${newRotate}deg)`;
      }
    );
  }

  // Apply timed animations with rotation handling
  let adjustedAnimationStyle = combinedStyle;
  if (
    rotationValue > 0 &&
    adjustedAnimationStyle.transform &&
    adjustedAnimationStyle.transform.includes("translateX")
  ) {
    adjustedAnimationStyle = {
      ...adjustedAnimationStyle,
      transform: adjustedAnimationStyle.transform.replace(
        /translateX\(([^)]+)\)/g,
        (_, value) => {
          const numValue = parseFloat(value);
          return `translateX(${numValue}px)`;
        }
      )
    };
  }

  return (
    <div
      style={{
        overflow: combinedStyle.overflow || "visible",
        pointerEvents: "none",
        height: style.height,
        width: style.width,
        ...adjustedAnimationStyle
      }}
    >
      <div
        style={{
          ...combinedStyle,
          overflow: "visible",
          pointerEvents: "none",
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {children}
      </div>
    </div>
  );
};
