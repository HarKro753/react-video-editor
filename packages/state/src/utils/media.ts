import { ITrackItem } from "@designcombo/types";
import { getCorsOptions } from "../state-options";

export const getImageInfo = (
  src: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const width = img.width;
      const height = img.height;

      resolve({ width, height });
    };

    img.onerror = (error) => {
      reject(error);
    };
    const corsOptions = getCorsOptions();
    if (corsOptions.image) {
      img.crossOrigin = "anonymous";
    }
    img.src = src;
  });
};

export const getAudioInfo = (src: string): Promise<{ duration: number }> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    // audio.crossOrigin = "anonymous"; // Enable cross-origin access if audio is hosted elsewhere
    audio.preload = "auto";

    audio.addEventListener("loadedmetadata", () => {
      const duration = audio.duration * 1000;

      resolve({ duration });
    });

    audio.addEventListener("error", (error) => {
      reject(error);
    });

    audio.src = src;
    const corsOptions = getCorsOptions();
    if (corsOptions.audio) {
      audio.crossOrigin = "anonymous";
    }
    audio.load();
  });
};

export const getVideoInfo = (
  src: string
): Promise<{ duration: number; width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    // video.crossOrigin = "anonymous"; // Enable cross-origin access if video is hosted elsewhere
    video.preload = "auto";

    video.addEventListener("loadedmetadata", () => {
      const duration = video.duration * 1000;
      const width = video.videoWidth;
      const height = video.videoHeight;

      resolve({ duration, width, height });
    });

    video.addEventListener("error", (error) => {
      reject(error);
    });

    video.src = src;
    const corsOptions = getCorsOptions();
    if (corsOptions.video) {
      video.crossOrigin = "anonymous";
    }
    video.load();
  });
};

export const getIVideotemInfo = async (item: ITrackItem) => {
  const duration = item.duration;
  const width = item.details?.width;
  const height = item.details?.height;
  if (duration && width && height) {
    return { duration, width, height };
  }
  return getVideoInfo(item.details.src);
};

export const getTextInfo = (text: string, styles: any) => {
  const measureTextDiv = document.createElement("div");
  // add the text styles to the div
  Object.keys(styles).forEach((key) => {
    if (key !== "height") {
      measureTextDiv.style[key as any] = styles[key];
    }
  });

  // add the div to the body
  document.body.appendChild(measureTextDiv);
  measureTextDiv.textContent = text;
  measureTextDiv.style.whiteSpace = "normal";
  measureTextDiv.style.position = "absolute";
  measureTextDiv.style.visibility = "hidden";
  measureTextDiv.style.display = "inline-block";
  measureTextDiv.style.width = styles.width + "px";
  measureTextDiv.style.fontSize = styles.fontSize + "px";
  //   measureTextDiv.style.height = 'auto';
  const height = getComputedStyle(measureTextDiv).height;
  // remove the div from the body
  document.body.removeChild(measureTextDiv);

  return parseFloat(height);
};
