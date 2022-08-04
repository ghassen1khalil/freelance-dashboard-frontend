import {createAction, props} from '@ngrx/store';
import {Event} from '../models/models';

export const LaunchEvent = createAction(
  '[EVENT] - Launch event',
  props<{event: Event}>()
)

export const ClearEvent = createAction(
  '[EVENT] - Clear event'
)
