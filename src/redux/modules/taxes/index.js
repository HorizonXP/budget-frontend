import { Map } from 'immutable';
import { handleActions, createAction } from 'redux-actions';

// action constants
const SET_ACTIVE_TAB = 'budget/dashboards/taxes/SET_ACTIVE_TAB';

// action creators
export const setActiveTab = createAction(SET_ACTIVE_TAB);

const INITIAL_STATE = new Map({
  activeTab: 'yours'
});

export function getActiveTab(state) {
  return state.get('activeTab');
}

const reducerMap = {};

reducerMap[SET_ACTIVE_TAB] = (state, action) =>
  state.set('activeTab', action.payload);

export default handleActions(reducerMap, INITIAL_STATE);
