import { resizeAudio } from "./audio";
import { changeWidth } from "./common";
import { resizeMedia } from "./media";
import { resizeTransitionWidth } from "./transition";

export const resize = {
  audio: resizeAudio,
  media: resizeMedia,
  common: changeWidth,
  transition: resizeTransitionWidth
};
