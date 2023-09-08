import {Injectable} from '@angular/core';
import {Position, PositionsService, State} from '../../../../generated';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, finalize, map, mergeAll, mergeMap, Observable, of} from 'rxjs';
import {Action} from '@ngrx/store';
import * as PositionActions from '../actions/position.actions';
import {HttpErrorResponse} from '@angular/common/http';
import {switchMap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {LaunchEvent} from '../actions/event.actions';
import {EventType} from '../models/models';
import {TranslateService} from '@ngx-translate/core';
import {EventService} from '../../services/event.service'; // Import merge operator from RxJS


@Injectable()
export class PositionEffects {
  constructor(private positionService: PositionsService,
              private action$: Actions,
              private router: Router,
              private translate: TranslateService,
              private eventService: EventService) {
  }

  FilterPositions$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(PositionActions.FilterPositions),
      mergeMap(action =>
        this.positionService.filterByKeyword(action.keyword).pipe(
          map((positions: Position[]) => {
            return PositionActions.SetFilteredPositions({positions: positions});
          }),
          catchError((error: HttpErrorResponse) => {
            return of(PositionActions.FetchPositionsFailure({payload: error}));
          })
        )
      )
    )
  );

  FetchPositions$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(PositionActions.FetchPositions),
      mergeMap(() =>
        this.positionService.findAll().pipe(
          map((positions: Position[]): Action => { // specify type explicitly
            return PositionActions.FetchPositionsSuccess({payload: positions});
          }),
          catchError((error: HttpErrorResponse) => {
            return new Observable<Action>((observer) => { // specify type explicitly
              this.translate.get(['error', 'fetchPositionsErrorMessage']).subscribe((res) => {
                observer.next(PositionActions.FetchPositionsFailure({payload: error}));
                observer.next(LaunchEvent({
                  event: this.eventService.createEventFromLocalizedMessage(res, 'error', 'fetchPositionsErrorMessage', EventType.ERROR)
                }));
                observer.complete();
              });
            });
          })
        )
      )
    )
  );


  SavePosition$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(PositionActions.SavePosition),
      switchMap(action =>
        this.positionService.save(action.position).pipe(
          switchMap(() => this.translate.get(['success', 'savePositionSuccessMessage']).pipe(
            map((res) => LaunchEvent({
              event: this.eventService.createEventFromLocalizedMessage(res, 'success', 'savePositionSuccessMessage', EventType.SUCCESS)
            }))
          )),
          switchMap((successEvent) => [
            of(successEvent),
            this.positionService.findAll().pipe(
              map((positions: Position[]) => PositionActions.FetchPositionsSuccess({payload: positions})),
              catchError((error: HttpErrorResponse) => {
                return this.translate.get(['error', 'findAllErrorMessage']).pipe(
                  map((res) => LaunchEvent({
                    event: this.eventService.createEventFromLocalizedMessage(res, 'error', 'findAllErrorMessage', EventType.ERROR)
                  }))
                );
              }),
              finalize(() => {
                this.router.navigate(['/main']);
              })
            )
          ]),
          mergeAll(),
          catchError((error: HttpErrorResponse) => {
            return this.translate.get(['error', 'savePositionErrorMessage']).pipe(
              map((res) => LaunchEvent({
                event: this.eventService.createEventFromLocalizedMessage(res, 'error', 'savePositionErrorMessage', EventType.ERROR)
              }))
            );
          })
        )
      )
    ) as Observable<Action>
  );

  /*UpdatePosition$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(PositionActions.UpdatePosition),
      switchMap(action =>
        this.positionService.update(action.position.id ? action.position.id : '', action.position).pipe(
          switchMap(() => this.translate.get(['success', 'updatePositionSuccessMessage', 'deletePositionSuccessMessage']).pipe(
            map((res) =>
              LaunchEvent({
                event: this.eventService.createEventFromLocalizedMessage(res, 'success', action.position.state === State.Deleted ? 'deletePositionSuccessMessage' : 'updatePositionSuccessMessage', EventType.SUCCESS)
              })
            )
          )),
          switchMap((successEvent) => [
            of(successEvent),
            this.positionService.findAll().pipe(
              map((positions: Position[]) => PositionActions.FetchPositionsSuccess({payload: positions})),
              catchError((error: HttpErrorResponse) => {
                return this.translate.get(['error', 'findAllErrorMessage']).pipe(
                  map((res) => LaunchEvent({
                    event: this.eventService.createEventFromLocalizedMessage(res, 'error', 'findAllErrorMessage', EventType.ERROR)
                  }))
                );
              })
            )
          ]),
          mergeAll(),
          tap(() => {
            this.router.navigate(['/main']);
          }),
          catchError((error: HttpErrorResponse) => {
            return this.translate.get(['error', 'updatePositionErrorMessage', 'deletePositionErrorMessage']).pipe(
              map((res) => LaunchEvent({
                event: this.eventService.createEventFromLocalizedMessage(res, 'error', action.position.state === State.Deleted ? 'deletePositionErrorMessage' : 'updatePositionErrorMessage', EventType.ERROR)
              }))
            );
          })
        )
      )
    ) as Observable<Action>
  );*/

  UpdatePosition$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(PositionActions.UpdatePosition),
      switchMap(action =>
        this.positionService.update(action.position.id ? action.position.id : '', action.position).pipe(
          switchMap(() => this.translate.get(['success', 'updatePositionSuccessMessage', 'deletePositionSuccessMessage']).pipe(
            map((res) =>
              LaunchEvent({
                event: this.eventService.createEventFromLocalizedMessage(res, 'success', action.position.state === State.Deleted ? 'deletePositionSuccessMessage' : 'updatePositionSuccessMessage', EventType.SUCCESS)
              })
            )
          )),
          switchMap((successEvent) => [
            of(successEvent),
            this.positionService.findAll().pipe(
              map((positions: Position[]) => PositionActions.FetchPositionsSuccess({payload: positions})),
              catchError((error: HttpErrorResponse) => {
                return this.translate.get(['error', 'findAllErrorMessage']).pipe(
                  map((res) => LaunchEvent({
                    event: this.eventService.createEventFromLocalizedMessage(res, 'error', 'findAllErrorMessage', EventType.ERROR)
                  }))
                );
              }),
              finalize(() => {
                // Navigate to /main after the FetchPositionsSuccess action is dispatched.
                this.router.navigate(['/main']);
              })
            )
          ]),
          mergeAll(),
          catchError((error: HttpErrorResponse) => {
            return this.translate.get(['error', 'updatePositionErrorMessage', 'deletePositionErrorMessage']).pipe(
              map((res) => LaunchEvent({
                event: this.eventService.createEventFromLocalizedMessage(res, 'error', action.position.state === State.Deleted ? 'deletePositionErrorMessage' : 'updatePositionErrorMessage', EventType.ERROR)
              }))
            );
          })
        )
      )
    ) as Observable<Action>
  );
}
