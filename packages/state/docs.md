### Updete many items

```ts
import { dispatch } from "@designcombo/events";

dispatch(EDIT_OBJECT, {
  payload: {
    [id_1]: {
      ...object,
      [key]: value,
    },
    [id_2]: {
      ...object,
      [key]: value,
    },
  },
});

dispatch(ADD_MANY, {
  payload: {
    trackItemIds: [],
    trackItemsMap: {},
    trackItemDetailsMap: [],
    tracks: [],
  },
});

dispatch(ADD_TEXT, {
  payload: {},
  options: {},
});

dispatch(BULK_ACTIONS, {
  payload: [
    {
      type: ADD_IMAGE,
      payload: {},
      options: {},
    },
    {
      type: ADD_VIDEO,
      payload: {},
      options: {},
    },
    {
      type: DELETE_LAYER,
      payload: {},
      options: {},
    },
  ],
});
```
