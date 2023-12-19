import {createAction, props} from '@ngrx/store';
import {HttpErrorResponse} from '@angular/common/http';
import {UpdateType} from '../../domain/update-type.enum';
import {InformationUpdateRequest} from '../../../../generated/model/informationUpdateRequest';
import {PasswordUpdateRequest} from '../../../../generated';

export const UpdateFreelancerInformations = createAction(
  '[FREELANCER] - Update Freelancer Personal Informations',
  props<{ informationsUpdateRequest: InformationUpdateRequest }>()
)

export const UpdateFreelancerPassword = createAction(
  '[FREELANCER] - Update Freelancer Password',
  props<{ passwordUpdateRequest: PasswordUpdateRequest }>()
)

export const UpdateFreelancerSuccess = createAction(
  '[FREELANCER] - Update Freelancer successful'
)

export const UpdateFreelancerFailure = createAction(
  '[FREELANCER] - Update Freelancer failure',
  props<{ error: HttpErrorResponse }>()
)


export const GetFreelancerByEmail = createAction(
  '[FREELANCER] - Get Freelancer by email',
  props< {email: string} >()
);
