import {createAction, props} from '@ngrx/store';

export const LoadSkills = createAction(
  '[Skills] Load Skills',
  props<{ role?: string; project?: string; team?: string }>()
);

export const LoadSkillsSuccess = createAction(
  '[Skills] Load Skills Success',
  props<{ skills: string[] }>()
);

export const LoadSkillsFailure = createAction(
  '[Skills] Load Skills Failure',
  props<{ error: any }>()
);
