import React, { useMemo } from "react";
import { combineAnimations, useAnimation } from "./use-animation";

export interface Animation {
  property: keyof React.CSSProperties | string;
  from: number;
  to: number;
  durationInFrames: number;
  ease: (t: number) => number;
  delay?: number;
}
export interface AnimatedProps {
  animationIn?: Animation | Animation[] | null;
  animationOut?: Animation | Animation[] | null;
  durationInFrames: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  frame: number;
  isTransition?: boolean;
}

export const BoxAnim: React.FC<AnimatedProps> = ({
  animationIn,
  animationOut,
  durationInFrames,
  children,
  style = {},
  frame,
  isTransition = false
}) => {
  const inStyle = useAnimation(
    combineAnimations(animationIn!),
    durationInFrames,
    frame,
    false
  );
  const outStyle = useAnimation(
    combineAnimations(animationOut!),
    durationInFrames,
    frame,
    true
  );

  const validatedInStyle = React.useMemo(() => {
    // Check if animation has actually started (considering delays)
    const hasAnimationStarted = Object.keys(inStyle).length > 0;
    const findMinAnimationDelay = (animationIn as Animation[])?.reduce(
      (min, anim) => {
        return Math.min(min, anim.delay || 0);
      },
      Infinity
    );
    const validateFrame = frame - (findMinAnimationDelay || 0);
    if (hasAnimationStarted && validateFrame < 0) {
      return { visibility: isTransition ? "visible" : ("hidden" as const) };
    }
    return inStyle;
  }, [inStyle, frame, animationIn]);

  const validatedOutStyle = React.useMemo(() => {
    const hasOutAnimationStarted = (animationOut as Animation[])?.length > 0;
    const findMaxOutAnimationEnd = (animationOut as Animation[])?.reduce(
      (max, anim) => {
        const animationEnd = anim.delay || 0;
        return Math.max(max, animationEnd);
      },
      0
    );
    if (
      hasOutAnimationStarted &&
      frame > durationInFrames - findMaxOutAnimationEnd
    ) {
      return { visibility: isTransition ? "visible" : ("hidden" as const) };
    }
    return outStyle;
  }, [outStyle, frame, animationOut]);

  // Extract rotation from item.details.transform
  const transformStyle = style?.transform || "";
  const match = transformStyle.match(/rotate\((-?[\d.]+)deg\)/);
  const rotationValue = match ? parseFloat(match[1]) : 0;
  const resetRotationValue = -rotationValue;
  const combinedStyle = React.useMemo(() => {
    const result = {
      ...validatedInStyle
      // , ...timedStyle
    } as { [key: string]: any };
    Object.entries(validatedOutStyle).forEach(([key, value]) => {
      if (key === "transform") {
        result[key] = `${result[key] || ""} ${value || ""}`.trim();
      } else if (
        key in result &&
        typeof result[key] === "number" &&
        typeof value === "number"
      ) {
        result[key] = result[key] * value;
      } else {
        result[key] = value;
      }
    });
    return result as React.CSSProperties;
  }, [validatedInStyle, validatedOutStyle]);

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

  const animatedTransform = useMemo(() => {
    const combinedTransform = combinedStyle.transform || "";
    const { translateX, translateY, scale, rotation, rotateY } =
      extractTransformations(combinedTransform);

    return `${translateX} ${translateY} ${scale} ${
      rotation || `rotate(${rotationValue}deg)`
    } ${rotateY}`.trim();
  }, [combinedStyle, rotationValue]);

  // Simple fix: invert translateX when there's rotation
  let adjustedAnimationStyle = inStyle;
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
        ...adjustedAnimationStyle,
        transform:
          (adjustedAnimationStyle.transform || "") +
          ` -rotate(${resetRotationValue}deg) scale(1)`,
        background:
          Object.keys(combinedStyle).length === 0
            ? "transparent"
            : combinedStyle.backgroundColor,
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          ...style,
          ...combinedStyle,
          rotate: `${resetRotationValue}deg`,
          overflow: "visible",
          transform: animatedTransform,
          pointerEvents: "none",
          background:
            Object.keys(combinedStyle).length === 0
              ? "transparent"
              : combinedStyle.backgroundColor
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Export a more flexible combine function
export const combine = (
  ...animations: (Animation | Animation[] | undefined)[]
): Animation[] => {
  const flattened: Animation[] = [];

  animations.forEach((anim) => {
    if (Array.isArray(anim)) {
      flattened.push(...anim);
    } else if (anim) {
      flattened.push(anim);
    }
  });

  return flattened
    .filter((anim): anim is Animation => anim !== undefined)
    .reduce((acc: Animation[], curr: Animation) => {
      const existingAnim = acc.find(
        (a: Animation) => a.property === curr.property
      );
      if (existingAnim) {
        // Merge animations for the same property
        return acc.map((a: Animation) =>
          a.property === curr.property
            ? {
                ...a,
                from: Math.min(a.from, curr.from),
                to: Math.max(a.to, curr.to),
                durationInFrames: Math.max(
                  a.durationInFrames,
                  curr.durationInFrames
                ),
                delay: Math.min(a.delay || 0, curr.delay || 0),
                ease: (t: number) => (a.ease(t) + curr.ease(t)) / 2 // Average the easing functions
              }
            : a
        );
      } else {
        // Add new animation
        return [...acc, curr];
      }
    }, [] as Animation[]);
};

export const extractTransformations = (transform: string) => {
  let translateX = "";
  let translateY = "";
  let scale = "scale(1)";
  let rotation = "";
  let rotateY = "";

  const translateXMatch = transform.match(/translateX\([^)]+\)/);
  if (translateXMatch) {
    translateX = translateXMatch[0];
  }

  const translateYMatch = transform.match(/translateY\([^)]+\)/);
  if (translateYMatch) {
    translateY = translateYMatch[0];
  }

  const scaleMatch = transform.match(/scale\([^)]+\)/);
  if (scaleMatch) {
    scale = scaleMatch[0];
  }

  const rotationMatch = transform.match(/rotate\([^)]+\)/);
  if (rotationMatch) {
    rotation = rotationMatch[0];
  }

  const rotateYMatch = transform.match(/rotateY\([^)]+\)/);
  if (rotateYMatch) {
    rotateY = rotateYMatch[0];
  }

  return { translateX, translateY, scale, rotation, rotateY };
};
