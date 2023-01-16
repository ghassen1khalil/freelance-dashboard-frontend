import { Action, ActionReducer } from "@ngrx/store";
import * as HydrationActions from "../actions/hydration.actions";
import {PositionState} from '../state/app.states';


function isHydrateSuccess(
  action: Action
): action is ReturnType<typeof HydrationActions.hydrateSuccess> {
  return action.type === HydrationActions.hydrateSuccess.type;
}

export const hydrationMetaReducer = (
  reducer: ActionReducer<PositionState>
): ActionReducer<PositionState> => {
  return (state, action) => {
    if (isHydrateSuccess(action)) {
      return action.state;
    } else {
      return reducer(state, action);
    }
  };
};
