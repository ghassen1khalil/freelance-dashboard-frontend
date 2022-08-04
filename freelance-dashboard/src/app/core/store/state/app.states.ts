import {Position} from '../../../../../generated';
import {Event} from '../models/models';

export interface AppState {
  positionState: PositionState;
  eventState: EventState;
}

export interface PositionState {
  positions: Position[];
}

export interface EventState {
   event: Event | undefined;
}
