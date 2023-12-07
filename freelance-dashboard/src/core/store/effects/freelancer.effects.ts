import {inject, Injectable} from '@angular/core';
import {FreelancerService} from '../../../../generated';
import {catchError, map, Observable, of, switchMap} from 'rxjs';
import {Action} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import * as FreelancerActions from '../actions/freelancer.actions';

@Injectable()
export class FreelancerEffects {

  freelancerService = inject(FreelancerService);

  constructor(private action$: Actions) {
  }

  UpdateFreelancer: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(FreelancerActions.UpdateFreelancer),
      switchMap(action =>
        this.freelancerService.updateFreelancer(action.freelancer).pipe(
          map(() => FreelancerActions.UpdateFreelancerSuccess),
          catchError(error => of(FreelancerActions.UpdateFreelancerFailure({error: error})))
        )
      )
    )
  );
}
