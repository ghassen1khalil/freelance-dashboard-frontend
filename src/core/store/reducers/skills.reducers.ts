import {createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import * as SkillsActions from '../actions/skills.actions';

export interface SkillsState {
  allSkills: string[];
  loading: boolean;
  error?: any;
}

export const initialState: SkillsState = {
  allSkills: [],
  loading: false,
  error: undefined
};

export const skillsReducer = createReducer(
  initialState,
  on(SkillsActions.LoadSkills, (state) => ({...state, loading: true, error: undefined})),
  on(SkillsActions.LoadSkillsSuccess, (state, {skills}) => ({...state, allSkills: skills ?? [], loading: false})),
  on(SkillsActions.LoadSkillsFailure, (state, {error}) => ({...state, loading: false, error}))
);

export interface HasSkillsState {
  skillsState: SkillsState;
}

export const getSkillsState = createFeatureSelector<SkillsState>('skillsState');
export const getAllSkills = createSelector(getSkillsState, (state) => state.allSkills);
export const getSkillsLoading = createSelector(getSkillsState, (state) => state.loading);
