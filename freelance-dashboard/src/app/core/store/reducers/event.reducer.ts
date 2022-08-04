import * as EventActions from '../actions/event.actions';
import {EventState} from '../state/app.states';
import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';

export const initialEventState: EventState = {event: undefined}

const _eventReducer = createReducer(
  initialEventState,
  on(EventActions.LaunchEvent, (state, {event}) => {
    return {...state, event: event}
  }),
  on(EventActions.ClearEvent, state => state)
);

export function eventReducer(
  state: EventState | undefined,
  action: Action
) {
  return _eventReducer(state, action)
}

export const getEventState = createFeatureSelector<EventState>('eventState');

export const getEvent = createSelector(
  getEventState,
  (state: EventState) => state.event
);
