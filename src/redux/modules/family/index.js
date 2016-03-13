/* eslint-disable no-param-reassign */
import { Set } from 'immutable';
import { handleActions, createAction } from 'redux-actions';
import { bind } from 'redux-effects';
import ApiClient from 'helpers/ApiClient';
import { FamilyState, Member } from 'redux/records';

// action constants
const LOAD = 'budget/family/LOAD';
const LOAD_SUCCESS = 'budget/family/LOAD_SUCCESS';
const LOAD_FAILURE = 'budget/family/LOAD_FAILURE';

// action creators
const loadFamily = createAction(LOAD);
const loadFamilySuccess = createAction(LOAD_SUCCESS);
const loadFamilyFailure = createAction(LOAD_FAILURE);

const INITIAL_STATE = new FamilyState();

// action creator creators
export function load() {
  return [
    loadFamily(),
    bind(
      ApiClient.get('/v1/accounts/current/'),
      ({ value: { family } }) => loadFamilySuccess(family),
      ({ value }) => loadFamilyFailure(value)
    )
  ];
}

const reducerMap = {};

reducerMap[LOAD] = initialState =>
  initialState.withMutations(state => {
    state.loadError = null;
    state.loading = false;
  });

reducerMap[LOAD_SUCCESS] = (initialState, action) =>
  initialState.withMutations(state => {
    const { id, members, name } = action.payload;
    state.loadError = null;
    state.loading = false;
    state.loaded = true;
    state.name = name;
    state.id = id;
    state.members = new Set(members.map(member => new Member({ ...member })));
  });

reducerMap[LOAD_FAILURE] = (initialState, action) =>
  initialState.withMutations(state => {
    state.loadError = action.payload;
    state.loading = false;
    state.loaded = false;
    state.name = null;
    state.id = null;
    state.members = new Set();
  });

export default handleActions(reducerMap, INITIAL_STATE);
