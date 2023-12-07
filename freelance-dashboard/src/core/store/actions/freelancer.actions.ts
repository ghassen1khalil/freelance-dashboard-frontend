import {createAction, props} from '@ngrx/store';
import {Freelancer} from '../../../../generated';
import {HttpErrorResponse} from '@angular/common/http';

export const UpdateFreelancer = createAction(
  '[FREELANCER] - Update Freelancer',
  props<{ freelancer: Freelancer }>()
)

export const UpdateFreelancerSuccess = createAction(
  '[FREELANCER] - Update Freelancer successful'
)

export const UpdateFreelancerFailure = createAction(
  '[FREELANCER] - Update Freelancer failure',
  props<{ error: HttpErrorResponse }>()
)
