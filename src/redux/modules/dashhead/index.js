/* eslint-disable no-param-reassign */
import { handleActions, createAction } from 'redux-actions';
import { DashHeadState } from 'redux/records';

// action constants
const SET_TITLE = 'bootstrap/themes/dashhead/SET_TITLE';
const SET_GROUP = 'bootstrap/themes/dashhead/SET_GROUP';

// action creators
export const setTitle = createAction(SET_TITLE);
export const setGroup = createAction(SET_GROUP);

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

export default handleActions(reducerMap, INITIAL_STATE);

