import { Map } from 'immutable';
import { handleActions, createAction } from 'redux-actions';

// action constants
const SHOW = 'bootstrap/themes/sidebar/SHOW';
const HIDE = 'bootstrap/themes/sidebar/HIDE';
const TOGGLE = 'bootstrap/themes/sidebar/TOGGLE';

// action creators
export const show = createAction(SHOW);
export const hide = createAction(HIDE);
export const toggle = createAction(TOGGLE);

const INITIAL_STATE = new Map({
  collapsed: false,
});

export function collapsed(state) {
  return state.get('collapsed');
}

const reducerMap = {};

reducerMap[SHOW] = state =>
  state.set('collapsed', false);

reducerMap[HIDE] = state =>
  state.set('collapsed', true);

reducerMap[TOGGLE] = state =>
  state.set('collapsed', !state.get('collapsed'));

export default handleActions(reducerMap, INITIAL_STATE);

