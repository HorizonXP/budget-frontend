/* eslint-disable no-param-reassign */
import { handleActions, createAction } from 'redux-actions';
import { DashHeadState } from 'redux/records';
import { LOGOUT_SUCCESS } from 'redux/modules/user';

// action constants
const SET_TITLE = 'bootstrap/themes/dashhead/SET_TITLE';
const SET_GROUP = 'bootstrap/themes/dashhead/SET_GROUP';
const SET_START_DATE = 'bootstrap/themes/dashhead/SET_START_DATE';

// action creators
export const setTitle = createAction(SET_TITLE);
export const setGroup = createAction(SET_GROUP);
export const setStartDate = createAction(SET_START_DATE);

const INITIAL_STATE = new DashHeadState();

const reducerMap = {};

reducerMap[SET_GROUP] = (initialState, action) =>
  initialState.withMutations(state => {
    state.group = action.payload;
  });

reducerMap[SET_TITLE] = (initialState, action) =>
  initialState.withMutations(state => {
    state.title = action.payload;
  });

reducerMap[SET_START_DATE] = (initialState, action) =>
  initialState.withMutations(state => {
    state.startDate = action.payload;
  });

reducerMap[LOGOUT_SUCCESS] = () => INITIAL_STATE;

export default handleActions(reducerMap, INITIAL_STATE);

