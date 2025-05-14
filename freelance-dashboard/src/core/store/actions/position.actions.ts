import {createAction, props} from '@ngrx/store';
import {Position} from '../../../../generated';
import {HttpErrorResponse} from '@angular/common/http';

export const FetchPositions = createAction(
  '[POSITION] - Fetch Positions',
  props<{ tenantId: string | undefined }>()
);

export const FetchPositionsSuccess = createAction(
  '[POSITION] - Fetch Positions Success',
  props<{ payload: { [stateKey: string]: { [statusKey: string]: Array<Position>; }; } }>()
);

export const FetchPositionsFailure = createAction(
  '[POSITION] - Fetch Positions Failure',
  props<{ payload: HttpErrorResponse }>()
);

export const SavePosition = createAction(
  '[POSITION] - Save new position',
  props<{ position: Position }>()
);

export const SavePositionFailure = createAction(
  '[POSITION] - Save New Position Failure',
  props<{ error: HttpErrorResponse }>()
);

export const UpdatePosition = createAction(
  '[POSITION] - Update Position',
  props<{ position: Position }>()
);

export const EditPosition = createAction(
  '[POSITION] - Edit Position',
  props<{ positionToEdit: Position }>()
);

export const ResetPositionToEdit = createAction(
  '[POSITION] - Reset Position to edit'
);

export const GenerateFollowupMail = createAction(
  '[POSITION] - Generate Followup Mail',
  props<{ positionId: string }>()
);

