interface StateOptions {
  cors: {
    audio?: boolean;
    video?: boolean;
    image?: boolean;
  };
  acceptsMap: Record<string, string[]>;
}

let stateOptions: StateOptions = {
  cors: {
    audio: true,
    video: true,
    image: true
  },
  acceptsMap: {
    text: ["text", "caption", "composition"],
    image: ["image", "video"],
    video: ["video", "image"],
    audio: ["audio"],
    composition: ["composition"],
    caption: ["caption", "text", "composition"],
    template: ["template", "image", "video"],
    customTrack: ["video", "image", "template"],
    customTrack2: ["video", "image", "template"],
    illustration: ["illustration", "custom"],
    custom: ["custom", "video", "illustration"],
    main: ["video", "image", "template"],
    shape: ["shape", "custom", "illustration"],
    linealAudioBars: ["audio", "linealAudioBars"],
    radialAudioBars: ["audio", "radialAudioBars"],
    progressFrame: ["audio", "progressFrame"],
    progressBar: ["audio", "progressBar"],
    rect: ["rect"],
    progressSquare: ["progressSquare"]
  }
};

export const setStateOptions = (options: Partial<StateOptions>) => {
  // Only merge properties that are actually provided (not undefined)
  const validOptions = Object.fromEntries(
    Object.entries(options).filter(([_, value]) => value !== undefined)
  );
  stateOptions = { ...stateOptions, ...validOptions };
};

export const getStateOptions = (): StateOptions => {
  return stateOptions;
};

export const getCorsOptions = () => {
  return stateOptions.cors;
};

export const getAcceptsMap = () => {
  return stateOptions.acceptsMap;
};
