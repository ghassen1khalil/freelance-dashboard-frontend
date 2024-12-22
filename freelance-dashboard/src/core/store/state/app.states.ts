import {Freelancer, Position} from '../../../../generated';
import {Event} from '../models/models';

export interface AppState {
  positionState: PositionState;
  eventState: EventState;
  authState: AuthState;
  loaderState: LoaderState;
  filterState: FilterState;
  passwordResetTokenState: PasswordResetTokenState
}

export interface PositionState {
  positions: { [stateKey: string]: { [statusKey: string]: Array<Position>; }; } | undefined;
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

export interface FilterState {
  filter: string | undefined;
  filteredPositions: Position[] | undefined;
}

export interface PasswordResetTokenState {
  isTokenValid: boolean;
}
