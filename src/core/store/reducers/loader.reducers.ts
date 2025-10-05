import * as LoaderActions from '../actions/loader.actions';
import {LoaderState} from '../state/app.states';
import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';

export const initialLoaderState: LoaderState = {isLoaderShown: false};

const _loaderReducer = createReducer(
  initialLoaderState,
  on(LoaderActions.SetLoader, (state, {isLoaderShown}) => {
    if (state.isLoaderShown === isLoaderShown) {
      return state;
    } else {
      return {...state, isLoaderShown: isLoaderShown}
    }
  })
);

export function loaderReducer(
  state: LoaderState | undefined,
  action: Action
) {
  return _loaderReducer(state, action);
}

export const getLoaderState = createFeatureSelector<LoaderState>('loaderState');

export const getLoader = createSelector(
  getLoaderState,
  (state: LoaderState) => state.isLoaderShown
);
