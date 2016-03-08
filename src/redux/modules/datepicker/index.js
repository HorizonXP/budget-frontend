import { Map } from 'immutable';
import { handleActions, createAction } from 'redux-actions';

// action constants
const SHOW = 'bootstrap/themes/datepicker/SHOW';
const HIDE = 'bootstrap/themes/datepicker/HIDE';
const TOGGLE = 'bootstrap/themes/datepicker/TOGGLE';
const SET_START_DATE = 'bootstrap/themes/datepicker/SET_START_DATE';
const SET_END_DATE = 'bootstrap/themes/datepicker/SET_END_DATE';

// action creators
export const show = createAction(SHOW);
export const hide = createAction(HIDE);
export const toggle = createAction(TOGGLE);
export const setStartDate = createAction(SET_START_DATE);
export const setEndDate = createAction(SET_END_DATE);

const INITIAL_STATE = new Map({
  shown: false,
  startDate: new Date(),
  endDate: null
});

export function isShown(state) {
  return state.get('shown');
}

export function getStartDate(state) {
  return state.get('startDate');
}

export function getEndDate(state) {
  return state.get('endDate');
}

const reducerMap = {};

reducerMap[SHOW] = state =>
  state.set('shown', true);

reducerMap[HIDE] = state =>
  state.set('shown', false);

reducerMap[TOGGLE] = state =>
  state.set('shown', !state.get('shown'));

reducerMap[SET_START_DATE] = (state, action) =>
  state.set('startDate', action.payload);

reducerMap[SET_END_DATE] = (state, action) =>
  state.set('endDate', action.payload);

export default handleActions(reducerMap, INITIAL_STATE);

