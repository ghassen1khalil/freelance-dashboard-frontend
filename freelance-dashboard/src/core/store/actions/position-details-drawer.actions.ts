//export an action to open the position details drawer
import {Position} from '../../../../generated';
import {createAction, props} from '@ngrx/store';

export const OpenPositionDetailsDrawer = createAction(
  '[POSITION DETAILS DRAWER] - Open Position Details Drawer',
  props<{
    position: Position,
    isDrawerShown: boolean,
    isCreation: boolean
  }>()
);
