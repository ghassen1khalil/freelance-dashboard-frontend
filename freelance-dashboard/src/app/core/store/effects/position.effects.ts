import {Injectable} from '@angular/core';
import {Position, PositionsService} from '../../../../../generated';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap, Observable, of} from 'rxjs';
import {Action} from '@ngrx/store';
import * as PositionActions from '../actions/position.action';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class PositionEffects {
  constructor(private positionService: PositionsService, private action$: Actions) {
  }


  FetchPositions$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(PositionActions.FetchPositions),
      mergeMap(action =>
        this.positionService.findAll().pipe(
          map((positions: Position[]) => {
            return PositionActions.FetchPositionsSuccess({payload: positions});
          }),
          catchError((error: HttpErrorResponse) => {
            return of(PositionActions.FetchPositionsFailure({payload: error}));
          })
        )
      )
    )
  );

  SavePosition$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(PositionActions.SaveNewPosition),
      mergeMap(action =>
        this.positionService.save(action.position).pipe(
          map(() => {
            return PositionActions.FetchPositions();
          }),
          catchError((err: HttpErrorResponse) => {
            return of(PositionActions.SaveNewPositionFailure({error: err}));
          })
        )
      )
    )
  );
}
