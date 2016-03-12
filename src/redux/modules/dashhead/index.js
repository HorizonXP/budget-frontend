import { Map } from 'immutable';
import { handleActions, createAction } from 'redux-actions';

// action constants
const SET_TITLE = 'bootstrap/themes/dashhead/SET_TITLE';
const SET_GROUP = 'bootstrap/themes/dashhead/SET_GROUP';

// action creators
export const setTitle = createAction(SET_TITLE);
export const setGroup = createAction(SET_GROUP);

const INITIAL_STATE = new Map({
  title: '',
  group: ''
});

export function getTitle(state) {
  return state.get('title');
}

export function getGroup(state) {
  return state.get('group');
}

const reducerMap = {};

reducerMap[SET_GROUP] = (state, action) =>
  state.set('group', action.payload);

reducerMap[SET_TITLE] = (state, action) =>
  state.set('title', action.payload);

export default handleActions(reducerMap, INITIAL_STATE);

