import {PositionDetailsDrawerState} from '../state/app.states';
import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import * as PositionDetailsDrawerActions from '../actions/position-details-drawer.actions';

export const initialPositionDetailsDrawerState: PositionDetailsDrawerState = {
  isDrawerShown: false,
  position: undefined,
  isCreation: false,
  isDuplication: false
}

const _positionDetailsDrawerReducer = createReducer(
  initialPositionDetailsDrawerState,
  on(PositionDetailsDrawerActions.OpenPositionDetailsDrawer, (state, {position, isCreation, isDuplication}) => {
    return {...state, isDrawerShown: true, position: position, isCreation: isCreation, isDuplication: isDuplication}
  }),
  on(PositionDetailsDrawerActions.ClosePositionDetailsDrawer, (state) => {
    return {...state, isDrawerShown: false, position: undefined, isDuplication: false, isCreation: false}
  })
);

export function positionDetailsDrawerReducer(
  state: PositionDetailsDrawerState | undefined,
  action: Action
) {
  return _positionDetailsDrawerReducer(state, action);
}

export const getPositionDetailsDrawerState = createFeatureSelector<PositionDetailsDrawerState>('positionDetailsDrawerState');

export const getPositionDetailsDrawer = createSelector(
  getPositionDetailsDrawerState,
  (state: PositionDetailsDrawerState) => state
)
