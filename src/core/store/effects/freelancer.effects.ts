import {inject, Injectable} from '@angular/core';
import {FreelancerService} from '../../../../generated';
import {catchError, map, mergeMap, Observable, switchMap} from 'rxjs';
import {Action} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import * as FreelancerActions from '../actions/freelancer.actions';
import {GetFreelancerByEmail} from '../actions/freelancer.actions';
import * as AuthActions from '../actions/auth.actions';
import {SetFreelancer} from '../actions/auth.actions';
import {EventService} from '../../services/event.service';
import {LaunchEvent} from '../actions/event.actions';
import {TranslateService} from '@ngx-translate/core';
import {EventType} from '../models/models';

@Injectable()
export class FreelancerEffects {

  freelancerService = inject(FreelancerService);

  constructor(private action$: Actions,
              private eventService: EventService,
              private translate: TranslateService) {
  }

  UpdateFreelancerInformations$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(FreelancerActions.UpdateFreelancerInformations),
      switchMap(action =>
        this.freelancerService.updateInformations(action.informationsUpdateRequest).pipe(
          switchMap(() => this.translate.get(['success', 'personalInfoModified']).pipe(
            mergeMap((res) => {
                return [
                  LaunchEvent({
                      event: this.eventService.createEventFromLocalizedMessage(
                        res,
                        'success',
                        'personalInfoModified',
                        EventType.INFO
                      )
                    }
                  ),
                  GetFreelancerByEmail({email: action.informationsUpdateRequest.email!})
                ]}
            ))),
          catchError((error) => {
            return new Observable<Action>((observer) => {
              this.translate.get(['error', 'updatePersonalInfoError']).subscribe((res) => {
                observer.next(LaunchEvent({
                  event: this.eventService.createEventFromLocalizedMessage(res, 'error', 'updatePersonalInfoError', EventType.ERROR)
                }));
                observer.complete();
              })
            })
          })
        )
      )
    )
  );

  UpdateFreelancerPassword$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(FreelancerActions.UpdateFreelancerPassword),
      switchMap(action =>
        this.freelancerService.updatePassword(action.passwordUpdateRequest).pipe(
          switchMap(() => this.translate.get(['success', 'passwordModified']).pipe(
            map((res) => {
                return LaunchEvent({
                    event: this.eventService.createEventFromLocalizedMessage(
                      res,
                      'success',
                      'passwordModified',
                      EventType.INFO
                    )
                  }
                )
              }
            ))
          ),
          catchError((error) => {
            return new Observable<Action>((observer) => {
              this.translate.get(['error', 'updatePasswordError']).subscribe((res) => {
                observer.next(LaunchEvent({
                  event: this.eventService.createEventFromLocalizedMessage(res, 'error', 'updatePasswordError', EventType.ERROR)
                }));
                observer.complete();
              })
            })
          })
        )
      )
    )
  );

  GetFreelancerByEmail$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(FreelancerActions.GetFreelancerByEmail),
      switchMap(action => this.freelancerService.getFreelancerByEmail(action.email).pipe(
        map((res) => SetFreelancer({freelancer: res})),
        catchError((error) => {
          return new Observable<Action>((observer) => {
            this.translate.get(['error', 'getFreelancerByEmailError']).subscribe((res) => {
              observer.next(LaunchEvent({
                event: this.eventService.createEventFromLocalizedMessage(res, 'error', 'getFreelancerByEmailError', EventType.ERROR)
              }));
              observer.complete();
            })
          })
        })
      ))
    )
  );

  DeleteAccount$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(FreelancerActions.DeleteAccount),
      switchMap(action => this.freelancerService.deleteAccount(action.id).pipe(
        map(() => AuthActions.Logout()),
        catchError((error) => {
          return new Observable<Action>((observer) => {
            this.translate.get(['error', 'deleteAccountError']).subscribe((res) => {
              observer.next(LaunchEvent({
                event: this.eventService.createEventFromLocalizedMessage(res, 'error', 'deleteAccountError', EventType.ERROR)
              }));
              observer.complete();
            })
          })
        })
      ))
    )
  );
}
