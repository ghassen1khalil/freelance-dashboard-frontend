import {createAction, props} from '@ngrx/store';
import {Position} from '../../../../generated';

export const FilterPositions = createAction(
  '[POSITION] – Filter positions by keyword',
  props<{ keyword: string }>()
);

export const SetFilteredPositions = createAction(
  '[POSITION] - Set Filtered Positions',
  props<{ positions: Position[] | undefined }>()
);

export const ResetFilter = createAction(
  '[FILTER] - Reset Filter'
);
