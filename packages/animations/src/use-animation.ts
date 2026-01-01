import React from "react";
import { interpolate } from "remotion";

export interface Animation {
  property: keyof React.CSSProperties | string;
  from: number;
  to: number;
  durationInFrames: number;
  ease: (t: number) => number;
  delay?: number;
  persist?: boolean;
}
type PropertyHandler = (value: number) => React.CSSProperties;

const createPropertyHandler = (): Record<string, PropertyHandler> => ({
  scale: (value: number) => ({ transform: `scale(${value})` }),
  opacity: (value: number) => ({ opacity: value }),
  translateX: (value: number) => ({ transform: `translateX(${value}px)` }),
  translateY: (value: number) => ({ transform: `translateY(${value}px)` }),
  rotate: (value: number) => ({ transform: `rotate(${value}deg)` }),
  default: () => ({}),
  rotateY: (value: number) => ({ transform: `rotateY(${value}deg)` }),
  shakeHorizontalIn: (value: number) => ({
    transform: `translateX(${value}px)`,
    overflow: "hidden"
  }),
  shakeVerticalIn: (value: number) => ({
    transform: `translateY(${value}px)`,
    overflow: "hidden"
  }),
  shakeHorizontalOut: (value: number) => ({
    transform: `translateX(${value}px)`,
    overflow: "hidden"
  }),
  shakeVerticalOut: (value: number) => ({
    transform: `translateY(${value}px)`,
    overflow: "hidden"
  })
});

const getShakeIntervals = (
  durationInFrames: number,
  initialFrame: number = 0
) => {
  const arrayInterval: number[] = [];
  const interval = durationInFrames / 5;
  for (let i = 0; i < 6; i += 1) {
    arrayInterval.push(i * interval + initialFrame);
  }
  return arrayInterval;
};

const interpolateValue = (
  frame: number,
  animation: Animation,
  durationInFrames: number,
  isOut: boolean = false
): number => {
  const { from, to, ease } = animation;
  const animationDurationInFrames = animation.durationInFrames || 30;

  const safeFrom = Number(from);
  const safeTo = Number(to);
  const safeDuration = Math.max(1, Number(animationDurationInFrames || 1));

  if (isNaN(safeFrom) || isNaN(safeTo)) {
    console.error("Invalid animation values:", {
      from,
      to,
      animationDurationInFrames,
      property: animation.property
    });
    return safeFrom;
  }

  if (animationDurationInFrames === undefined) {
    console.warn(
      `durationInFrames is undefined for animation: ${animation.property}. Using 1 frame as default.`
    );
  }

  const inputRange = isOut
    ? [durationInFrames - animationDurationInFrames, durationInFrames]
    : [0, safeDuration];

  if (animation.property.includes("shake")) {
    const intervalShake = !isOut
      ? getShakeIntervals(safeDuration)
      : getShakeIntervals(
          safeDuration,
          durationInFrames - animationDurationInFrames
        );
    return interpolate(
      frame,
      intervalShake,
      [0, safeFrom, safeTo, safeFrom, safeTo, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: ease
      }
    );
  }

  return interpolate(frame, inputRange, [safeFrom, safeTo], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease
  });
};

const calculateStyle = (
  animation: Animation,
  frame: number,
  durationInFrames: number,
  isOut: boolean
): React.CSSProperties => {
  const validateFrame = frame - (animation.delay || 0) * (isOut ? -1 : 1);
  const { property, durationInFrames: animationDurationInFrames } = animation;
  if (!isOut && validateFrame > animationDurationInFrames) return {};
  const value = interpolateValue(
    validateFrame,
    animation,
    durationInFrames,
    isOut
  );
  const propertyHandler = createPropertyHandler();
  return (propertyHandler[property] || propertyHandler.default)(value);
};

export const useAnimation = (
  animations: Animation[],
  durationInFrames: number,
  frame: number,
  isOut: boolean = false,
  isTimed: boolean = false
): React.CSSProperties => {
  return React.useMemo(() => {
    if (animations.length === 0) return {};

    // Filter out invalid animations at the start
    const validAnimations = animations.filter(
      (anim) => anim.from !== undefined && anim.to !== undefined
    );
    if (validAnimations.length !== animations.length) {
      console.error("Some animations are invalid and will be ignored");
    }
    if (isTimed) {
      const animationArrayTimed: React.CSSProperties[] = [];
      const persistStyles: Record<string, React.CSSProperties> = {};

      validAnimations.reverse().forEach((anim) => {
        const style = calculateStyle(anim, frame, durationInFrames, false);

        if (anim.persist === true) {
          const validateFrame = frame - (anim.delay || 0);

          if (validateFrame >= anim.durationInFrames) {
            const finalValue = anim.to;
            const propertyHandler = createPropertyHandler();
            const finalStyle = (
              propertyHandler[anim.property] || propertyHandler.default
            )(finalValue);

            Object.keys(finalStyle).forEach((key) => {
              if (key === "transform") {
                persistStyles[key] = persistStyles[key]
                  ? {
                      [key]: `${persistStyles[key][key as keyof React.CSSProperties]} ${finalStyle[key as keyof React.CSSProperties]}`
                    }
                  : finalStyle;
              } else {
                persistStyles[key] = finalStyle;
              }
            });
          }
        }

        animationArrayTimed.push(style);
      });

      const activeStyles = animationArrayTimed.reduce(
        (acc: React.CSSProperties, style: React.CSSProperties) => {
          Object.keys(style).forEach((key) => {
            if (key === "transform") {
              acc[key] = acc[key] ? `${acc[key]} ${style[key]}` : style[key];
            } else {
              acc[key as "transform"] = style[key as "transform"];
            }
          });
          return acc;
        },
        {}
      );

      const finalStyles = { ...activeStyles };

      Object.keys(persistStyles).forEach((key) => {
        const persistStyle = persistStyles[key];

        if (key === "transform" && persistStyle.transform) {
          finalStyles.transform = finalStyles.transform
            ? `${finalStyles.transform} ${persistStyle.transform}`
            : persistStyle.transform;
        } else if (
          persistStyle[key as keyof React.CSSProperties] !== undefined
        ) {
          (finalStyles as any)[key] =
            persistStyle[key as keyof React.CSSProperties];
        }
      });

      return finalStyles;
    } else {
      const animationArray = validAnimations.map((anim) => {
        return calculateStyle(anim, frame, durationInFrames, isOut);
      });

      return animationArray.reduce(
        (acc: React.CSSProperties, style: React.CSSProperties) => {
          Object.keys(style).forEach((key) => {
            if (key === "transform") {
              acc[key] = acc[key] ? `${acc[key]} ${style[key]}` : style[key];
            } else {
              acc[key as "transform"] = style[key as "transform"];
            }
          });
          return acc;
        },
        {}
      );
    }
  }, [animations, frame, durationInFrames, isOut]);
};

export const combineAnimations = (
  animations: Animation | Animation[] | undefined
): Animation[] => {
  if (!animations) return [];
  return Array.isArray(animations) ? animations : [animations];
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
