import {PositionDetailsDrawerState} from '../state/app.states';
import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import * as PositionDetailsDrawerActions from '../actions/position-details-drawer.actions';

export const initialPositionDetailsDrawerState: PositionDetailsDrawerState = {
  isDrawerShown: false,
  position: undefined
}

const _positionDetailsDrawerReducer = createReducer(
  initialPositionDetailsDrawerState,
  on(PositionDetailsDrawerActions.OpenPositionDetailsDrawer, (state, {position}) => {
    return {...state, isDrawerShown: true, position: position}
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
