Complete API documentation for the DesignCombo Video Editor SDK.

## StateManager

The central state management class for the video editor.

### Constructor

```typescript
new StateManager(initialState?: State, config?: StateManagerConfig)
```

**Parameters:**

- `initialState` (optional): Initial state object
- `config` (optional): Configuration options

**Returns:** StateManager instance

### Methods

#### updateState

```typescript
updateState(updates: Partial<State>, options?: IUpdateStateOptions): void
```

Updates the state with new values.

**Parameters:**

- `updates`: Partial state object with updates
- `options`: Update options including history tracking

#### subscribe

```typescript
subscribe(callback: (state: State) => void): Subscription
```

Subscribes to all state changes.

**Parameters:**

- `callback`: Function called when state changes

**Returns:** Subscription object for unsubscribing

#### subscribeToActiveIds

```typescript
subscribeToActiveIds(callback: (data: { activeIds: string[] }) => void): Subscription
```

Subscribes to active item ID changes.

#### subscribeToTracks

```typescript
subscribeToTracks(callback: (data: { tracks: ITrack[], changedTracks: string[] }) => void): Subscription
```

Subscribes to track changes.

#### subscribeToUpdateTrackItem

```typescript
subscribeToUpdateTrackItem(callback: (data: { trackItemsMap: Record<string, ITrackItem> }) => void): Subscription
```

Subscribes to track item updates.

#### addTrackItem

```typescript
addTrackItem(item: Omit<ITrackItem, 'id'>): string
```

Adds a new track item to the state.

**Parameters:**

- `item`: Track item data (without ID)

**Returns:** Generated item ID

#### updateTrackItem

```typescript
updateTrackItem(id: string, updates: Partial<ITrackItem>): void
```

Updates an existing track item.

#### removeTrackItem

```typescript
removeTrackItem(id: string): void
```

Removes a track item from the state.

#### getElements

```typescript
getElements(): ITrackItem[]
```

Gets all track items.

**Returns:** Array of track items

#### getActiveElements

```typescript
getActiveElements(): ITrackItem[]
```

Gets currently active track items.

**Returns:** Array of active track items

#### undo

```typescript
undo(): void
```

Undoes the last operation.

#### redo

```typescript
redo(): void
```

Redoes the last undone operation.

#### exportState

```typescript
exportState(): State
```

Exports the current state.

**Returns:** Complete state object

#### importState

```typescript

```

Imports a state object.

#### purge

```typescript
purge(): void
```

Cleans up the state manager and removes all subscriptions.

## Timeline

The timeline visualization and interaction class.

### Constructor

```typescript
new Timeline(canvas: HTMLCanvasElement, config: TimelineConfig)
```

**Parameters:**

- `canvas`: HTML canvas element
- `config`: Timeline configuration

**Returns:** Timeline instance

### Methods

#### setCanvasSize

```typescript
setCanvasSize(width: number, height: number): void
```

Sets the canvas size.

#### render

```typescript
render(): void
```

Forces a re-render of the timeline.

#### getCurrentTime

```typescript
getCurrentTime(): number
```

Gets the current playhead position.

**Returns:** Current time in milliseconds

#### setCurrentTime

```typescript
setCurrentTime(time: number): void
```

Sets the playhead position.

#### getScale

```typescript
getScale(): ITimelineScaleState
```

Gets the current scale settings.

**Returns:** Scale state object

#### setScale

```typescript
setScale(scale: ITimelineScaleState): void
```

Sets the timeline scale.

#### play

```typescript
play(): void
```

Starts timeline playback.

#### pause

```typescript
pause(): void
```

Pauses timeline playback.

#### stop

```typescript
stop(): void
```

Stops timeline playback.

#### isPlaying

```typescript
isPlaying(): boolean
```

Checks if timeline is playing.

**Returns:** True if playing

#### selectItems

```typescript
selectItems(ids: string[]): void
```

Selects timeline items.

#### getSelectedItems

```typescript
getSelectedItems(): ITrackItem[]
```

Gets selected items.

**Returns:** Array of selected items

#### enableDragAndDrop

```typescript
enableDragAndDrop(): void
```

Enables drag and drop functionality.

#### enableResizing

```typescript
enableResizing(): void
```

Enables item resizing.

#### enableSnapping

```typescript
enableSnapping(): void
```

Enables snapping functionality.

#### setSnapSettings

```typescript
setSnapSettings(settings: SnapSettings): void
```

Sets snapping configuration.

#### zoomIn

```typescript
zoomIn(): void
```

Zooms in the timeline.

#### zoomOut

```typescript
zoomOut(): void
```

Zooms out the timeline.

#### zoomToFit

```typescript
zoomToFit(): void
```

Zooms to fit all content.

#### pan

```typescript
pan(x: number, y: number): void
```

Pans the timeline view.

#### getViewport

```typescript
getViewport(): Viewport
```

Gets the current viewport.

**Returns:** Viewport object

#### setItemRenderer

```typescript
setItemRenderer(type: string, renderer: ItemRenderer): void
```

Sets a custom item renderer.

#### onDragStart

```typescript
onDragStart(callback: (item: ITrackItem, event: DragEvent) => void): void
```

Sets drag start callback.

#### onDragMove

```typescript
onDragMove(callback: (item: ITrackItem, event: DragEvent) => void): void
```

Sets drag move callback.

#### onDragEnd

```typescript
onDragEnd(callback: (item: ITrackItem, event: DragEvent) => void): void
```

Sets drag end callback.

#### onResizeStart

```typescript
onResizeStart(callback: (item: ITrackItem, event: ResizeEvent) => void): void
```

Sets resize start callback.

#### onResizeMove

```typescript
onResizeMove(callback: (item: ITrackItem, event: ResizeEvent) => void): void
```

Sets resize move callback.

#### onResizeEnd

```typescript
onResizeEnd(callback: (item: ITrackItem, event: ResizeEvent) => void): void
```

Sets resize end callback.

#### onClick

```typescript
onClick(callback: (event: MouseEvent) => void): void
```

Sets click callback.

#### onDoubleClick

```typescript
onDoubleClick(callback: (event: MouseEvent) => void): void
```

Sets double click callback.

#### onWheel

```typescript
onWheel(callback: (event: WheelEvent) => void): void
```

Sets wheel callback.

#### onKeyDown

```typescript
onKeyDown(callback: (event: KeyboardEvent) => void): void
```

Sets key down callback.

#### enableVirtualScrolling

```typescript
enableVirtualScrolling(config: VirtualScrollConfig): void
```

Enables virtual scrolling for large timelines.

#### enableLazyLoading

```typescript
enableLazyLoading(config: LazyLoadConfig): void
```

Enables lazy loading for items.

#### setRenderOptimizations

```typescript
setRenderOptimizations(config: RenderOptimizationConfig): void
```

Sets rendering optimization options.

#### enableItemCaching

```typescript
enableItemCaching(config: CacheConfig): void
```

Enables item caching.

#### setTheme

```typescript
setTheme(theme: TimelineTheme): void
```

Sets the timeline theme.

#### setInteractionHandler

```typescript
setInteractionHandler(type: string, handler: InteractionHandler): void
```

Sets a custom interaction handler.

#### setValidationHandler

```typescript
setValidationHandler(handler: ValidationHandler): void
```

Sets a custom validation handler.

#### validateItemPlacement

```typescript
validateItemPlacement(item: ITrackItem, track: ITrack): boolean
```

Validates item placement on a track.

**Returns:** True if valid

#### validateItemTiming

```typescript
validateItemTiming(item: ITrackItem, constraints: TimingConstraints): boolean
```

Validates item timing constraints.

**Returns:** True if valid

#### deleteSelectedItems

```typescript
deleteSelectedItems(): void
```

Deletes selected items.

#### clearSelection

```typescript
clearSelection(): void
```

Clears the current selection.

#### removeAllListeners

```typescript
removeAllListeners(): void
```

Removes all event listeners.

#### clearCanvas

```typescript
clearCanvas(): void
```

Clears the canvas.

#### purge

```typescript
purge(): void
```

Cleans up the timeline and removes all listeners.

## Event System

### dispatch

```typescript
dispatch(type: string, event: Event): void
```

Dispatches an event.

**Parameters:**

- `type`: Event type constant
- `event`: Event object with payload and options

### Event Structure

```typescript
interface Event {
  payload: any;
  options?: EventOptions;
}

interface EventOptions {
  silent?: boolean;
  skipHistory?: boolean;
  batch?: boolean;
}
```

### Event Categories

#### Add Events

- `ADD_TEXT` - Add text item
- `ADD_IMAGE` - Add image item
- `ADD_VIDEO` - Add video item
- `ADD_AUDIO` - Add audio item
- `ADD_SHAPE` - Add shape item
- `ADD_CAPTION` - Add caption item
- `ADD_TEMPLATE` - Add template item
- `ADD_ILLUSTRATION` - Add illustration item
- `ADD_COMPOSITION` - Add composition item
- `ADD_RECT` - Add rectangle item
- `ADD_PROGRESS_BAR` - Add progress bar
- `ADD_PROGRESS_FRAME` - Add progress frame
- `ADD_LINEAL_AUDIO_BARS` - Add lineal audio bars
- `ADD_RADIAL_AUDIO_BARS` - Add radial audio bars
- `ADD_TRANSITION` - Add transition
- `ADD_TRACK` - Add track

#### Edit Events

- `EDIT_OBJECT` - Edit object properties
- `EDIT_BULK` - Bulk edit operations
- `REPLACE_MEDIA` - Replace media content
- `EDIT_BACKGROUND_EDITOR` - Edit background

#### Layer Events

- `LAYER_SELECT` - Select layer/item
- `LAYER_DELETE` - Delete layer/item
- `LAYER_CLONE` - Clone layer/item
- `LAYER_COPY` - Copy layer/item

#### Design Events

- `DESIGN_LOAD` - Load design
- `DESIGN_RESIZE` - Resize design
- `DESIGN_EXPORT` - Export design

#### History Events

- `HISTORY_UNDO` - Undo operation
- `HISTORY_REDO` - Redo operation

#### Active Object Events

- `ACTIVE_PASTE` - Paste active object
- `ACTIVE_SPLIT` - Split active object

#### Timeline Scale Events

- `TIMELINE_SCALE_CHANGED` - Timeline scale changed

## Animation System

### addAnimation

```typescript
dispatch(ADD_ANIMATION, {
  payload: {
    itemId: string,
    animation: IAnimation,
  },
});
```

Adds an animation to an item.

### addAnimations

```typescript
dispatch(ADD_ANIMATIONS, {
  payload: {
    itemId: string,
    animations: IAnimation[]
  }
})
```

Adds multiple animations to an item.

### updateAnimation

```typescript
dispatch(EDIT_OBJECT, {
  payload: {
    id: string,
    updates: {
      animations: IAnimation[]
    }
  }
})
```

Updates an animation.

### removeAnimation

```typescript
dispatch(EDIT_OBJECT, {
  payload: {
    id: string,
    updates: {
      animations: IAnimation[]
    }
  }
})
```

Removes an animation.

### addAnimationPreset

```typescript
dispatch(ADD_ANIMATION_PRESET, {
  payload: {
    itemId: string,
    preset: PresetName,
  },
});
```

Adds an animation preset.

### addAnimationSequence

```typescript
dispatch(ADD_ANIMATION_SEQUENCE, {
  payload: {
    itemId: string,
    sequence: PresetName[]
  }
})
```

Adds an animation sequence.

### Animation Presets

The SDK includes a comprehensive set of animation presets:

#### Basic Animations

- `fadeIn` - Fade in effect
- `fadeOut` - Fade out effect
- `scaleIn` - Scale in effect
- `scaleOut` - Scale out effect
- `slideInRight` - Slide in from right
- `slideInLeft` - Slide in from left
- `slideInTop` - Slide in from top
- `slideInBottom` - Slide in from bottom
- `slideOutRight` - Slide out to right
- `slideOutLeft` - Slide out to left
- `slideOutTop` - Slide out to top
- `slideOutBottom` - Slide out to bottom
- `rotateIn` - Rotate in effect
- `flipIn` - Flip in effect

#### Shake Animations

- `shakeHorizontalIn` - Horizontal shake in
- `shakeVerticalIn` - Vertical shake in
- `shakeHorizontalOut` - Horizontal shake out
- `shakeVerticalOut` - Vertical shake out

#### Text Animations

- `typeWriterIn` - Typewriter effect in
- `typeWriterOut` - Typewriter effect out
- `animatedTextIn` - Animated text in
- `animatedTextOut` - Animated text out

#### Special Text Animations

- `sunnyMorningsAnimationIn` - Sunny mornings animation in
- `sunnyMorningsAnimationOut` - Sunny mornings animation out
- `dominoDreamsIn` - Domino dreams in
- `dominoDreamsAnimationOut` - Domino dreams out
- `greatThinkersAnimationIn` - Great thinkers animation in
- `greatThinkersAnimationOut` - Great thinkers animation out
- `beautifulQuestionsAnimationIn` - Beautiful questions animation in
- `beautifulQuestionsAnimationOut` - Beautiful questions animation out
- `madeWithLoveAnimationIn` - Made with love animation in
- `madeWithLoveAnimationOut` - Made with love animation out
- `realityIsBrokenAnimationIn` - Reality is broken animation in
- `realityIsBrokenAnimationOut` - Reality is broken animation out

#### Loop Animations

- `vogueAnimationLoop` - Vogue animation loop
- `dragonFlyAnimationLoop` - Dragon fly animation loop
- `billboardAnimationLoop` - Billboard animation loop
- `heartbeatAnimationLoop` - Heartbeat animation loop
- `spinAnimationLoop` - Spin animation loop
- `waveAnimationLoop` - Wave animation loop
- `rotate3dAnimationLoop` - 3D rotate animation loop
- `shakeTextAnimationLoop` - Shake text animation loop
- `shakyLettersTextAnimationLoop` - Shaky letters text animation loop
- `vintageAnimationLoop` - Vintage animation loop
- `textFontChangeAnimationLoop` - Text font change animation loop
- `pulseAnimationLoop` - Pulse animation loop
- `glitchAnimationLoop` - Glitch animation loop

#### Special Effects

- `descompressAnimationIn` - Decompress animation in
- `descompressAnimationOut` - Decompress animation out
- `dropAnimationIn` - Drop animation in
- `dropAnimationOut` - Drop animation out
- `countDownAnimationIn` - Countdown animation in
- `soundWaveIn` - Sound wave animation in
- `backgroundAnimationIn` - Background animation in
- `backgroundAnimationOut` - Background animation out
- `progressSquareAnimationIn` - Progress square animation in
- `progressSquareAnimationOut` - Progress square animation out
- `partialSlideIn` - Partial slide in
- `partialSlideOut` - Partial slide out

### Using Animation Presets

```typescript
// Add a basic animation preset
dispatch(ADD_ANIMATION_PRESET, {
  payload: {
    itemId: "text-1",
    preset: "fadeIn",
  },
});

// Add a special text animation
dispatch(ADD_ANIMATION_PRESET, {
  payload: {
    itemId: "text-1",
    preset: "typeWriterIn",
  },
});

// Add a loop animation
dispatch(ADD_ANIMATION_PRESET, {
  payload: {
    itemId: "text-1",
    preset: "heartbeatAnimationLoop",
  },
});

// Add multiple animations
dispatch(ADD_ANIMATION_SEQUENCE, {
  payload: {
    itemId: "text-1",
    sequence: ["fadeIn", "slideInRight", "pulseAnimationLoop"],
  },
});
```

## Transition System

### addTransition

```typescript
dispatch(ADD_TRANSITION, {
  payload: {
    fromId: string,
    toId: string,
    trackId: string,
    kind: TransitionKind,
    duration: number,
    type: "transition",
    direction: string,
  },
});
```

Adds a transition between items.

### addTransitions

```typescript
dispatch(EDIT_BULK, {
  payload: {
    actions: ITransition[]
  }
})
```

Adds multiple transitions.

### updateTransition

```typescript
dispatch(EDIT_OBJECT, {
  payload: {
    id: string,
    updates: Partial<ITransition>,
  },
});
```

Updates a transition.

### removeTransition

```typescript
dispatch(LAYER_DELETE, {
  payload: {
    trackItemIds: [string],
  },
});
```

Removes a transition.

### addTransitionPreset

```typescript
dispatch(ADD_TRANSITION, {
  payload: {
    fromId: string,
    toId: string,
    trackId: string,
    kind: TransitionKind,
    duration: number,
    type: "transition",
    direction: string,
  },
});
```

Adds a transition preset.

## Item Operations

### addText

```typescript
dispatch(ADD_TEXT, {
  payload: {
    name: string,
    display: {
      from: number,
      to: number,
    },
    details: TextDetails,
  },
});
```

Adds a text item.

### addImage

```typescript
dispatch(ADD_IMAGE, {
  payload: {
    name: string,
    display: {
      from: number,
      to: number,
    },
    details: ImageDetails,
  },
});
```

Adds an image item.

### addVideo

```typescript
dispatch(ADD_VIDEO, {
  payload: {
    name: string,
    display: {
      from: number,
      to: number,
    },
    trim: {
      from: number,
      to: number,
    },
    details: VideoDetails,
  },
});
```

Adds a video item.

### addAudio

```typescript
dispatch(ADD_AUDIO, {
  payload: {
    name: string,
    display: {
      from: number,
      to: number,
    },
    trim: {
      from: number,
      to: number,
    },
    details: AudioDetails,
  },
});
```

Adds an audio item.

### updateItem

```typescript
dispatch(EDIT_OBJECT, {
  payload: {
    id: string,
    updates: Partial<ITrackItem>,
  },
});
```

Updates an item.

### removeItem

```typescript
dispatch(LAYER_DELETE, {
  payload: {
    trackItemIds: [string],
  },
});
```

Removes an item.

### selectItem

```typescript
dispatch(LAYER_SELECT, {
  payload: {
    trackItemIds: [string],
  },
});
```

Selects an item.

### selectItems

```typescript
dispatch(LAYER_SELECT, {
  payload: {
    trackItemIds: string[]
  }
})
```

Selects multiple items.

### clearSelection

```typescript
dispatch(LAYER_SELECT, {
  payload: {
    trackItemIds: [],
  },
});
```

Clears the selection.

## Timeline Controls

### Timeline Scale

```typescript
dispatch(TIMELINE_SCALE_CHANGED, {
  payload: {
    scale: ITimelineScaleState,
  },
});
```

Changes the timeline scale.

### History Management

```typescript
dispatch(HISTORY_UNDO);
```

Undoes the last operation.

```typescript
dispatch(HISTORY_REDO);
```

Redoes the last undone operation.

## Design Management

### loadDesign

```typescript
dispatch(DESIGN_LOAD, {
  payload: {
    data: State,
  },
});
```

Loads a design.

### resizeDesign

```typescript
dispatch(DESIGN_RESIZE, {
  payload: {
    size: ISize,
  },
});
```

Resizes the design.

### exportDesign

```typescript
dispatch(DESIGN_EXPORT, {
  payload: {
    format: string,
    quality: string,
    resolution: string,
  },
});
```

Exports a design.

## Bulk Operations

### Bulk Edit

```typescript
dispatch(EDIT_BULK, {
  payload: {
    actions: [
      {
        type: ADD_TEXT,
        payload: {
          /* text data */
        },
      },
      {
        type: ADD_IMAGE,
        payload: {
          /* image data */
        },
      },
    ],
  },
});
```

Performs multiple operations in a single dispatch.

### Bulk Delete

```typescript
dispatch(LAYER_DELETE, {
  payload: {
    trackItemIds: ["item-1", "item-2", "item-3"],
  },
});
```

Deletes multiple items at once.

### Bulk Selection

```typescript
dispatch(LAYER_SELECT, {
  payload: {
    trackItemIds: ["item-1", "item-2", "item-3"],
  },
});
```

Selects multiple items at once.

## Types

### State

```typescript
interface State {
  id: string;
  size: ISize;
  fps: number;
  background: Background;
  tracks: ITrack[];
  trackItemIds: string[];
  trackItemsMap: Record<string, ITrackItem>;
  transitionIds: string[];
  transitionsMap: Record<string, ITransition>;
  scale: ITimelineScaleState;
  duration: number;
  activeIds: string[];
  structure: ItemStructure[];
}
```

### ITrackItem

```typescript
interface ITrackItem {
  id: string;
  type: ITrackItemType;
  name: string;
  display: {
    from: number;
    to: number;
  };
  trim?: {
    from: number;
    to: number;
  };
  playbackRate?: number;
  isMain?: boolean;
  details: any;
  metadata?: Metadata;
}
```

### IAnimation

```typescript
interface IAnimation {
  property: string;
  from: number;
  to: number;
  durationInFrames: number;
  ease: EasingFunction;
  previewUrl?: string;
  name?: string;
  type?: "basic" | "special";
  details?: any;
}
```

### PresetName

```typescript
type PresetName =
  | "fadeIn"
  | "fadeOut"
  | "scaleIn"
  | "scaleOut"
  | "slideInRight"
  | "slideInLeft"
  | "slideInTop"
  | "slideInBottom"
  | "slideOutRight"
  | "slideOutLeft"
  | "slideOutTop"
  | "slideOutBottom"
  | "rotateIn"
  | "flipIn"
  | "shakeHorizontalIn"
  | "shakeVerticalIn"
  | "shakeHorizontalOut"
  | "shakeVerticalOut"
  | "typeWriterIn"
  | "typeWriterOut"
  | "animatedTextIn"
  | "animatedTextOut"
  | "sunnyMorningsAnimationIn"
  | "sunnyMorningsAnimationOut"
  | "dominoDreamsIn"
  | "dominoDreamsAnimationOut"
  | "greatThinkersAnimationIn"
  | "greatThinkersAnimationOut"
  | "beautifulQuestionsAnimationIn"
  | "beautifulQuestionsAnimationOut"
  | "madeWithLoveAnimationIn"
  | "madeWithLoveAnimationOut"
  | "realityIsBrokenAnimationIn"
  | "realityIsBrokenAnimationOut"
  | "vogueAnimationLoop"
  | "dragonFlyAnimationLoop"
  | "billboardAnimationLoop"
  | "heartbeatAnimationLoop"
  | "spinAnimationLoop"
  | "waveAnimationLoop"
  | "rotate3dAnimationLoop"
  | "shakeTextAnimationLoop"
  | "shakyLettersTextAnimationLoop"
  | "vintageAnimationLoop"
  | "textFontChangeAnimationLoop"
  | "pulseAnimationLoop"
  | "glitchAnimationLoop"
  | "descompressAnimationIn"
  | "descompressAnimationOut"
  | "dropAnimationIn"
  | "dropAnimationOut"
  | "countDownAnimationIn"
  | "soundWaveIn"
  | "backgroundAnimationIn"
  | "backgroundAnimationOut"
  | "progressSquareAnimationIn"
  | "progressSquareAnimationOut"
  | "partialSlideIn"
  | "partialSlideOut";
```

### ITransition

```typescript
interface ITransition {
  id: string;
  kind: TransitionKind;
  duration: number;
  fromId: string;
  toId: string;
  trackId: string;
  type: "transition";
  direction?: string;
}
```

## Next Steps

- Check out [Examples](./examples.mdx) for practical usage
- Understand [Customization](./customization.mdx) for advanced usage
