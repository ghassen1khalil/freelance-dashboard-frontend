import {Freelancer, Position} from '../../../../generated';
import {Event} from '../models/models';

export interface AppState {
  positionState: PositionState;
  eventState: EventState;
  authState: AuthState;
  loaderState: LoaderState;
}

export interface PositionState {
  positions: {[key: string]: Array<Position>} | undefined;
  filter: string | undefined;
  filteredPositions: Position[] | undefined;
  positionToEdit: Position | undefined;
}

export interface EventState {
  event: Event | undefined;
}

export interface AuthState {
  freelancer: Freelancer | undefined;
  isAuthenticated: boolean;
  token: string | undefined;
}

export interface LoaderState {
  isLoaderShown: boolean;
}
