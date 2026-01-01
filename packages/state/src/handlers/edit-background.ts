import { State } from "@designcombo/types";
import { cloneDeep } from "lodash";

interface BackgroundUpdate {
  type?: "color" | "image";
  value: any;
}

export function editBackground(
  state: State,
  update: BackgroundUpdate
): Partial<State> {
  const currentState = cloneDeep(state);

  // Update background properties
  currentState.background.value = update.value;
  currentState.background.type = update.type || "color";

  return {
    ...currentState
  };
}
