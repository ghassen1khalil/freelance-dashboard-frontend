import {createAction, props} from '@ngrx/store';

export const SetLoader = createAction(
  '[LOADER] - Set Loader',
  props<{ isLoaderShown: boolean}>()
);
