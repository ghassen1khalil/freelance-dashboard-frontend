import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {PositionsService} from '../../../../generated';
import * as SkillsActions from '../actions/skills.actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';

@Injectable()
export class SkillsEffects {

  loadSkills$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SkillsActions.LoadSkills),
      switchMap(({role, project, team}) => {
        const mission = {role, project, team};
        return this.positionsService.getSkills(mission).pipe(
          map((skills) => SkillsActions.LoadSkillsSuccess({skills})),
          catchError((error) => of(SkillsActions.LoadSkillsFailure({error})))
        );
      })
    )
  );

  constructor(private actions$: Actions,
              private positionsService: PositionsService) {
  }
}
