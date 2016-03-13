/* eslint-disable no-param-reassign */
import { handleActions, createAction } from 'redux-actions';
import { DatepickerState } from 'redux/records';

// action constants
const SHOW = 'bootstrap/themes/datepicker/SHOW';
const HIDE = 'bootstrap/themes/datepicker/HIDE';
const TOGGLE = 'bootstrap/themes/datepicker/TOGGLE';
const SET_START_DATE = 'bootstrap/themes/datepicker/SET_START_DATE';
const SET_END_DATE = 'bootstrap/themes/datepicker/SET_END_DATE';
const SET_VIEW_MODE = 'bootstrap/themes/datepicker/SET_VIEW_MODE';

// action creators
export const show = createAction(SHOW);
export const hide = createAction(HIDE);
export const toggle = createAction(TOGGLE);
export const setStartDate = createAction(SET_START_DATE);
export const setEndDate = createAction(SET_END_DATE);
export const setViewMode = createAction(SET_VIEW_MODE);

const INITIAL_STATE = new DatepickerState();

const reducerMap = {};

reducerMap[SHOW] = initialState =>
  initialState.withMutations(state => {
    state.shown = true;
  });

reducerMap[HIDE] = initialState =>
  initialState.withMutations(state => {
    state.shown = false;
  });

reducerMap[TOGGLE] = initialState =>
  initialState.withMutations(state => {
    state.shown = !state.shown;
  });

reducerMap[SET_START_DATE] = (initialState, action) =>
  initialState.withMutations(state => {
    state.startDate = action.payload;
  });

reducerMap[SET_END_DATE] = (initialState, action) =>
  initialState.withMutations(state => {
    state.endDate = action.payload;
  });

reducerMap[SET_VIEW_MODE] = (initialState, action) =>
  initialState.withMutations(state => {
    state.viewMode = action.payload;
  });

export default handleActions(reducerMap, INITIAL_STATE);

