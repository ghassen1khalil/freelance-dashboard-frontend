import {FilterState} from '../state/app.states';
import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import {FilterPositions, ResetFilter, SetFilteredPositions} from '../actions/filter.actions';

export const initialFilterState: FilterState = {
  filter: undefined,
  filteredPositions: undefined,
};

const _filterReducer = createReducer(
  initialFilterState,
  on(FilterPositions, (state, {keyword}) => {
    return {...state, filter: keyword}
  }),
  on(SetFilteredPositions, (state, {positions}) => {
    return {...state, filteredPositions: positions}
  }),
  on(ResetFilter, (state) => {
    return {...state, filter: undefined}
  }),
);

export function filterReducer(
  state: FilterState | undefined,
  action: Action
) {
  return _filterReducer(state, action);
}

export const getFilterState = createFeatureSelector<FilterState>('filterState');


export const getFilter = createSelector(
  getFilterState,
  (state: FilterState) => state.filter
);

export const getFilteredPositions = createSelector(
  getFilterState,
  (state: FilterState) => state.filteredPositions
);
