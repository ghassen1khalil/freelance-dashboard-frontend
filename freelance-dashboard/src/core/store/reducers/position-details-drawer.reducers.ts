import {PositionDetailsDrawerState} from '../state/app.states';
import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import * as PositionDetailsDrawerActions from '../actions/position-details-drawer.actions';

export const initialPositionDetailsDrawerState: PositionDetailsDrawerState = {
  isDrawerShown: false,
  position: undefined,
  isCreation: false
}

const _positionDetailsDrawerReducer = createReducer(
  initialPositionDetailsDrawerState,
  on(PositionDetailsDrawerActions.OpenPositionDetailsDrawer, (state, {position, isCreation}) => {
    return {...state, isDrawerShown: true, position: position, isCreation: isCreation}
  }),
  /*on(PositionDetailsDrawerActions.ClosePositionDetailsDrawer, (state) => {
    return {...state, isDrawerShown: false, position: undefined}
  })*/
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
