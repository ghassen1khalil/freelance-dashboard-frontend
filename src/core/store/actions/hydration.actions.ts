import {createAction, props} from '@ngrx/store';
import {PositionState} from '../state/app.states';

export const hydrate = createAction("[Hydration] Hydrate");

export const hydrateSuccess = createAction(
  "[Hydration] Hydrate Success",
  props<{ state: PositionState }>()
);

export const hydrateFailure = createAction("[Hydration] Hydrate Failure");
