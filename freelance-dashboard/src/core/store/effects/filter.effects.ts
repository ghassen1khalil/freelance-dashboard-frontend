import {Position, PositionsService} from '../../../../generated';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap, Observable, of} from 'rxjs';
import {Action} from '@ngrx/store';
import * as PositionActions from '../actions/position.actions';
import { HttpErrorResponse } from '@angular/common/http';
import {FilterPositions} from '../actions/filter.actions';
import {Injectable} from '@angular/core';

@Injectable()
export class FilterEffects {
  constructor(private positionService: PositionsService,
              private action$: Actions) {
  }

  FilterPositions$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(FilterPositions),
      mergeMap(action =>
        this.positionService.filterByKeyword(action.keyword).pipe(
          map((positions: {[key: string]: Array<Position>}) => {
            //return PositionActions.FetchPositionsSuccess({payload: positions});
            return PositionActions.FetchPositionsSuccess({payload: {}}); // TODO adapt for new return type
          }),
          catchError((error: HttpErrorResponse) => {
            return of(PositionActions.FetchPositionsFailure({payload: error}));
          })
        )
      )
    )
  );
}
