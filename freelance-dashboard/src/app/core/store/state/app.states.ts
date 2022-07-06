import {Position} from '../../../../../generated';

export interface AppState {
  positionState: PositionState;
}

export interface PositionState {
  positions: Position[];
}
