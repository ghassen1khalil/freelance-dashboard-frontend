import {createAction, props} from '@ngrx/store';
import {Position} from '../../../../generated';
import {HttpErrorResponse} from '@angular/common/http';

export const FetchPositions = createAction(
  '[POSITION] - Fetch Positions'
);

export const FetchPositionsSuccess = createAction(
  '[POSITION] - Fetch Positions Success',
  props<{ payload: Position[] }>()
);

export const FetchPositionsFailure = createAction(
  '[POSITION] - Fetch Positions Failure',
  props<{ payload: HttpErrorResponse }>()
);

export const SetPositions = createAction(
  '[POSITION] - Set Positions',
  props<{ payload: Position[] }>()
);

export const SaveNewPosition = createAction(
  '[POSITION] - Save new position',
  props<{ position: Position }>()
);

export const SaveNewPositionFailure = createAction(
  '[POSITION] - Save New Position Failure',
  props<{ error: HttpErrorResponse }>()
);

export const FilterPositions = createAction(
  '[POSITION] – Filter positions by keyword',
  props<{ keyword: string }>()
);

export const SetFilteredPositions = createAction(
  '[POSITION] - Set Filtered Positions',
  props<{ positions: Position[] | undefined}>()
);
