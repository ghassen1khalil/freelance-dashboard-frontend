import {Injectable} from '@angular/core';
import {Position, PositionsService, PositionState} from '../../../../generated';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mergeAll, mergeMap, Observable, of} from 'rxjs';
import {Action, select, Store} from '@ngrx/store';
import * as PositionActions from '../actions/position.actions';
import {HttpErrorResponse} from '@angular/common/http';
import {LaunchEvent} from '../actions/event.actions';
import {EventType} from '../models/models';
import {TranslateService} from '@ngx-translate/core';
import {EventService} from '../../services/event.service';
import {switchMap} from 'rxjs/operators';
import {EncryptionService} from '../../services/encryption.service'; // Import merge operator from RxJS
import {getAuthState} from '../reducers/auth.reducers';
import {AuthState} from '../state/app.states';


@Injectable()
export class PositionEffects {

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
            this.store.pipe(
              select(getAuthState),
              switchMap((authState: AuthState) => {
                const freelancerEmail = authState.freelancer?.email;
                return this.positionService.findPositions(this.encryptionService.encrypt(freelancerEmail!)).pipe(
                  map((positions: {
                    [stateKey: string]: { [statusKey: string]: Array<Position>; };
                  }) => PositionActions.FetchPositionsSuccess({payload: positions})),
                  catchError((error: HttpErrorResponse) => {
                    return this.translate.get(['error', 'findAllErrorMessage']).pipe(
                      map((res) => LaunchEvent({
                        event: this.eventService.createEventFromLocalizedMessage(res, 'error', 'findAllErrorMessage', EventType.ERROR)
                      }))
                    );
                  }),
                  /*finalize(() => {
                    this.router.navigate(['/main']);
                  })*/
                );
              })
            )
          ]),
          mergeAll(),
          catchError((error: HttpErrorResponse) => {
            return new Observable<Action>((observer) => { // specify type explicitly
              this.translate.get(['error', 'fetchPositionsErrorMessage']).subscribe((res) => {
                observer.next(PositionActions.SavePositionFailure({error: error}));
                observer.next(LaunchEvent({
                  event: this.eventService.createEventFromLocalizedMessage(res, 'error', 'savePositionErrorMessage', EventType.ERROR)
                }));
                observer.complete();
              });
            });
          })
        )
      )
    ) as Observable<Action>
  );


  FetchPositions$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(PositionActions.FetchPositions),
      mergeMap((action) =>
        this.positionService.findPositions(this.encryptionService.encrypt(action.tenantId!)).pipe(
          map((positions: { [stateKey: string]: { [statusKey: string]: Array<Position>; }; }): Action => { // specify type explicitly
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
  UpdatePosition$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(PositionActions.UpdatePosition),
      switchMap(action =>
        this.positionService.update(action.position.id!, action.position).pipe(
          switchMap(() => this.translate.get(['success', 'updatePositionSuccessMessage', 'deletePositionSuccessMessage']).pipe(
            map((res) =>
              LaunchEvent({
                event: this.eventService.createEventFromLocalizedMessage(res, 'success', action.position.state === PositionState.Deleted ? 'deletePositionSuccessMessage' : 'updatePositionSuccessMessage', EventType.SUCCESS)
              })
            )
          )),
          switchMap((successEvent) => [
            of(successEvent),
            this.store.pipe(
              select(getAuthState),
              switchMap((authState: AuthState) => {
                const freelancerEmail = authState.freelancer?.email;
                if (authState.freelancer?.id === undefined) {
                  throw new Error('Freelancer ID is undefined');
                }
                return this.positionService.findPositions(this.encryptionService.encrypt(freelancerEmail!)).pipe(
                  map((positions: {
                    [stateKey: string]: { [statusKey: string]: Array<Position>; };
                  }) => PositionActions.FetchPositionsSuccess({payload: positions})),
                  catchError((error: HttpErrorResponse) => {
                    return this.translate.get(['error', 'findAllErrorMessage']).pipe(
                      map((res) => LaunchEvent({
                        event: this.eventService.createEventFromLocalizedMessage(res, 'error', 'findAllErrorMessage', EventType.ERROR)
                      }))
                    );
                  }),
                  /*finalize(() => {
                    this.router.navigate(['/main']);
                  })*/
                );
              })
            )
          ]),
          mergeAll(),
          catchError((error: HttpErrorResponse) => {
            return this.translate.get(['error', 'updatePositionErrorMessage', 'deletePositionErrorMessage']).pipe(
              map((res) => LaunchEvent({
                event: this.eventService.createEventFromLocalizedMessage(
                  res,
                  'error',
                  action.position.state === PositionState.Deleted ? 'deletePositionErrorMessage' : 'updatePositionErrorMessage',
                  EventType.ERROR)
              }))
            );
          })
        )
      )
    ) as Observable<Action>
  );

  constructor(private positionService: PositionsService,
              private action$: Actions,
              private translate: TranslateService,
              private eventService: EventService,
              private encryptionService: EncryptionService,
              private store: Store) {
  }

  GenerateFollowupMail$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(PositionActions.GenerateFollowupMail),
      switchMap(action =>
        this.positionService.generateFollowupMail(action.positionId).pipe(
          switchMap(() => this.translate.get(['success', 'generateFollowupMailSuccessMessage']).pipe(
            map((res) => LaunchEvent({
              event: this.eventService.createEventFromLocalizedMessage(res, 'success', 'generateFollowupMailSuccessMessage', EventType.SUCCESS)
            }))
          )),
          catchError((error: HttpErrorResponse) => {
            return this.translate.get(['error', 'generateFollowupMailErrorMessage']).pipe(
              map((res) => LaunchEvent({
                event: this.eventService.createEventFromLocalizedMessage(res, 'error', 'generateFollowupMailErrorMessage', EventType.ERROR)
              }))
            );
          })
        )
      )
    ) as Observable<Action>
  );
}
