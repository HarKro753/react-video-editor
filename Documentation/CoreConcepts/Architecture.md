The DesignCombo Video Editor SDK is built with a modular, event-driven architecture that separates concerns between state management, timeline visualization, and user interface components.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   State Manager │    │   Timeline      │
│                 │    │                 │    │                 │
│ • UI Components │◄──►│ • State Store   │◄──►│ • Canvas        │
│ • Event Handlers│    │ • Event Handlers│    │ • Interactions  │
│ • User Actions  │    │ • Business Logic│    │ • Visualization │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Event System  │
                    │                 │
                    │ • Event Bus     │
                    │ • Event Filters │
                    │ • Event Handlers│
                    └─────────────────┘
```

## Core Components

### 1. State Manager (`@designcombo/state`)

The central state management system that serves as the single source of truth for all video editor data.

**Key Features:**

- **Reactive Updates**: Uses RxJS BehaviorSubject for reactive state updates
- **History Management**: Built-in undo/redo functionality
- **Selective Subscriptions**: Subscribe to specific state changes
- **Immutable Updates**: Uses Immer for immutable state updates

**State Structure:**

```typescript
interface State {
  // Design properties
  size: ISize; // Canvas dimensions
  fps: number; // Frames per second
  background: {
    type: "color" | "image";
    value: string;
  };

  // Timeline data
  tracks: ITrack[]; // Array of tracks
  trackItemIds: string[]; // Ordered list of item IDs
  trackItemsMap: Record<string, ITrackItem>; // Item lookup map
  transitionIds: string[]; // Ordered list of transition IDs
  transitionsMap: Record<string, ITransition>; // Transition lookup map

  // Timeline view
  scale: ITimelineScaleState; // Zoom and scale settings
  duration: number; // Total video duration

  // UI state
  activeIds: string[]; // Currently selected items
  structure: ItemStructure[]; // Nested structure for compositions
}
```

### 2. Timeline (`@designcombo/timeline`)

A canvas-based visualization system that renders the video timeline and handles user interactions.

**Key Features:**

- **Canvas Rendering**: Uses Fabric.js for high-performance rendering
- **Drag & Drop**: Intuitive item manipulation
- **Resize & Trim**: Visual trimming and resizing of items
- **Multi-selection**: Select and manipulate multiple items
- **Snapping**: Magnetic snapping to grid and other items

**Timeline Components:**

1. **Tracks**: Horizontal rows that contain media items
2. **Track Items**: Visual representations of media elements
3. **Transitions**: Effects between track items
4. **Playhead**: Current playback position indicator
5. **Scale Controls**: Zoom and time scale controls

### 3. Event System (`@designcombo/events`)

A centralized event system for communication between components.

**Event Architecture:**

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   UI Layer  │───►│ Event Bus   │───►│ State Layer │
│             │    │             │    │             │
│ • Buttons   │    │ • Dispatch  │    │ • Handlers  │
│ • Menus     │    │ • Filter    │    │ • Updates   │
│ • Keyboard  │    │ • Subscribe │    │ • Business  │
└─────────────┘    └─────────────┘    └─────────────┘
```

**Event Types:**

1. **Add Events**: `add:text`, `add:video`, `add:audio`, etc.
2. **Edit Events**: `edit:object`, `edit:background`, etc.
3. **Layer Events**: `layer:select`, `layer:delete`, `layer:move`, etc.
4. **History Events**: `history:undo`, `history:redo`
5. **Design Events**: `design:load`, `design:resize`

## Package Structure

```
packages/
├── state/           # State management and business logic
│   ├── src/
│   │   ├── StateManager.ts
│   │   ├── state/
│   │   ├── events/
│   │   └── utils/
│   └── package.json
├── timeline/        # Canvas timeline and interactions
│   ├── src/
│   │   ├── Timeline.ts
│   │   ├── canvas/
│   │   ├── interactions/
│   │   └── rendering/
│   └── package.json
├── types/           # TypeScript type definitions
│   ├── src/
│   │   ├── index.ts
│   │   ├── state.ts
│   │   ├── timeline.ts
│   │   └── events.ts
│   └── package.json
└── typescript-config/ # Shared TypeScript configuration

apps/
└── react/           # Example React application
```

## Data Flow

### 1. User Action Flow

```
User Action → Event Dispatch → State Update → UI Re-render
```

**Example:**

```typescript
// 1. User clicks "Add Text" button
// 2. Event is dispatched
dispatch("add:text", {
  payload: {
    name: "My Text",
    details: { text: "Hello World" },
  },
});

// 3. State manager processes event
// 4. State is updated
// 5. Timeline re-renders with new text element
```

### 2. State Subscription Flow

```
State Change → Subscription Notification → UI Update
```

**Example:**

```typescript
// Subscribe to active element changes
stateManager.subscribeToActiveIds(({ activeIds }) => {
  // Update UI to show selected elements
  updateSelectionUI(activeIds);
});
```

### 3. Timeline Interaction Flow

```
Timeline Interaction → Event Dispatch → State Update → Timeline Re-render
```

**Example:**

```typescript
// 1. User drags timeline item
// 2. Timeline dispatches move event
dispatch("move:item", {
  payload: { id: "item-1", x: 100, y: 200 },
});

// 3. State manager updates item position
// 4. Timeline re-renders with new position
```

## Design Principles

### 1. Separation of Concerns

- **State Manager**: Handles all business logic and data
- **Timeline**: Handles visualization and user interactions
- **Event System**: Handles communication between components
- **UI Components**: Handle user interface and user actions

### 2. Event-Driven Architecture

- All communication happens through events
- Components are loosely coupled
- Easy to extend and modify behavior
- Predictable data flow

### 3. Reactive Programming

- State changes automatically trigger updates
- Components react to state changes
- Efficient rendering and updates
- Real-time synchronization

### 4. Modular Design

- Each package has a specific responsibility
- Easy to use individual components
- Flexible integration options
- Scalable architecture

## Integration Patterns

### React Integration

```typescript
function VideoEditor() {
  const [stateManager, setStateManager] = useState<StateManager>();
  const [timeline, setTimeline] = useState<Timeline>();

  useEffect(() => {
    // Initialize state manager
    const sm = new StateManager(initialState);
    setStateManager(sm);

    // Initialize timeline
    const tl = new Timeline(canvas, { state: sm });
    setTimeline(tl);

    return () => {
      tl.purge();
      sm.purge();
    };
  }, []);

  // Subscribe to state changes
  useEffect(() => {
    if (!stateManager) return;

    const subscription = stateManager.subscribeToActiveIds(({ activeIds }) => {
      setSelectedItems(activeIds);
    });

    return () => subscription.unsubscribe();
  }, [stateManager]);

  return (
    <div>
      <TimelineCanvas ref={canvasRef} />
      <Controls onAddText={() => dispatch('add:text', { payload: {...} })} />
    </div>
  );
}
```

### Vanilla JavaScript Integration

```typescript
// Initialize components
const stateManager = new StateManager(initialState);
const timeline = new Timeline(canvas, { state: stateManager });

// Subscribe to changes
stateManager.subscribeToActiveIds(({ activeIds }) => {
  updateUI(activeIds);
});

// Handle user actions
document.getElementById('add-text').addEventListener('click', () => {
  dispatch('add:text', { payload: {...} });
});
```

## Next Steps

- Learn about [State Management](./state-management.mdx) in detail
- Explore the [Timeline System](./timeline-system.mdx)
- Understand the [Event System](./event-system.mdx)
- Check out [Examples](./development/examples.mdx) for practical usage
