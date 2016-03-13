/* eslint-disable no-param-reassign */
import { handleActions, createAction } from 'redux-actions';
import { TaxesState } from 'redux/records';
import { LOGOUT_SUCCESS } from 'redux/modules/user';

// action constants
const SET_ACTIVE_TAB = 'budget/dashboards/taxes/SET_ACTIVE_TAB';

// action creators
export const setActiveTab = createAction(SET_ACTIVE_TAB);

const INITIAL_STATE = new TaxesState();

const reducerMap = {};

reducerMap[SET_ACTIVE_TAB] = (initialState, action) =>
  initialState.withMutations(state => {
    state.activeTab = action.payload;
  });

reducerMap[LOGOUT_SUCCESS] = () => INITIAL_STATE;

export default handleActions(reducerMap, INITIAL_STATE);
