/* eslint-disable no-param-reassign */
import { handleActions, createAction } from 'redux-actions';
import { SidebarState } from 'redux/records';

// action constants
const SHOW = 'bootstrap/themes/sidebar/SHOW';
const HIDE = 'bootstrap/themes/sidebar/HIDE';
const TOGGLE = 'bootstrap/themes/sidebar/TOGGLE';

// action creators
export const show = createAction(SHOW);
export const hide = createAction(HIDE);
export const toggle = createAction(TOGGLE);

const INITIAL_STATE = new SidebarState();

const reducerMap = {};

reducerMap[SHOW] = initialState =>
  initialState.withMutations(state => {
    state.collapsed = false;
  });

reducerMap[HIDE] = initialState =>
  initialState.withMutations(state => {
    state.collapsed = true;
  });

reducerMap[TOGGLE] = initialState =>
  initialState.withMutations(state => {
    state.collapsed = !state.collapsed;
  });

export default handleActions(reducerMap, INITIAL_STATE);

