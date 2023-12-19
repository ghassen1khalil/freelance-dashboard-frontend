import {inject, Injectable} from '@angular/core';
import {FreelancerService} from '../../../../generated';
import {catchError, map, mergeMap, Observable, of, switchMap} from 'rxjs';
import {Action} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import * as FreelancerActions from '../actions/freelancer.actions';
import {GetFreelancerByEmail} from '../actions/freelancer.actions';
import {EventService} from '../../services/event.service';
import {LaunchEvent} from '../actions/event.actions';
import {TranslateService} from '@ngx-translate/core';
import {EventType} from '../models/models';
import {SetFreelancer} from '../actions/auth.actions';
import {EncryptionService} from '../../services/encryption.service';

@Injectable()
export class FreelancerEffects {

  freelancerService = inject(FreelancerService);

  constructor(private action$: Actions,
              private eventService: EventService,
              private translate: TranslateService,
              private encryptionService: EncryptionService) {
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
                  ]
                }
              )
            )
          ),
          catchError(error => of(FreelancerActions.UpdateFreelancerFailure({error: error})))
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
              )
            )
          ),
          catchError(error => of(FreelancerActions.UpdateFreelancerFailure({error: error})))
        )
      )
    )
  );

  GetFreelancerByEmail: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(FreelancerActions.GetFreelancerByEmail),
      switchMap(action => this.freelancerService.getFreelancerByEmail(action.email).pipe(
        map((res) => SetFreelancer({freelancer: res})),
        catchError((error) => of())
      ))
    )
  );
}
