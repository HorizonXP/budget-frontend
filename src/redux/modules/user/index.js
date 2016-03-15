/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import { handleActions, createAction } from 'redux-actions';
import parseToken from 'helpers/parseToken';
import { bind } from 'redux-effects';
import { cookie } from 'redux-effects-cookie';
import { timeout } from 'redux-effects-timeout';
import ApiClient from 'helpers/ApiClient';
import { UserState, Token } from 'redux/records';

// action constants
const LOAD = 'budget/user/LOAD';
const LOAD_SUCCESS = 'budget/user/LOAD_SUCCESS';
const LOAD_FAILURE = 'budget/user/LOAD_FAILURE';

const LOGIN = 'budget/user/LOGIN';
export const LOGIN_SUCCESS = 'budget/user/LOGIN_SUCCESS';
const LOGIN_FAILURE = 'budget/user/LOGIN_FAILURE';

const LOGOUT = 'budget/user/LOGOUT';
const LOGOUT_SUCCESS = 'budget/user/LOGOUT_SUCCESS';
const LOGOUT_FAILURE = 'budget/user/LOGOUT_FAILURE';

const UPDATE = 'budget/user/UPDATE';
const UPDATE_SUCCESS = 'budget/user/UPDATE_SUCCESS';
const UPDATE_FAILURE = 'budget/user/UPDATE_FAILURE';

const REFRESH_TOKEN = 'budget/user/REFRESH_TOKEN';
const REFRESH_TOKEN_SUCCESS = 'budget/user/REFRESH_TOKEN_SUCCESS';
const REFRESH_TOKEN_FAILURE = 'budget/user/REFRESH_TOKEN_FAILURE';

const SET_TOKEN = 'budget/user/SET_TOKEN';
const SET_UPDATED = 'budget/user/SET_UPDATED';

// action creators
const loadUser = createAction(LOAD);
const loadUserSuccess = createAction(LOAD_SUCCESS);
const loadUserFailure = createAction(LOAD_FAILURE);

const loginUser = createAction(LOGIN);
const loginUserSuccess = createAction(LOGIN_SUCCESS);
const loginUserFailure = createAction(LOGIN_FAILURE);

const logoutUser = createAction(LOGOUT);
const logoutUserSuccess = createAction(LOGOUT_SUCCESS);

const updateUser = createAction(UPDATE);
const updateUserSuccess = createAction(UPDATE_SUCCESS);
const updateUserFailure = createAction(UPDATE_FAILURE);

const refreshToken = createAction(REFRESH_TOKEN);
const refreshTokenSuccess = createAction(REFRESH_TOKEN_SUCCESS);
const refreshTokenFailure = createAction(REFRESH_TOKEN_FAILURE);

const setToken = createAction(SET_TOKEN);
const setUpdated = createAction(SET_UPDATED);

function accessTokenCookie(token) {
  if (token !== undefined) {
    const tokenObj = parseToken(token);
    const options = {};
    if (tokenObj) {
      options.expires = (new Date(tokenObj.exp * 1000));
      options.path = '/';
    } else {
      options.expires = (new Date(-1)); // delete cookie
      options.path = '/';
    }
    return cookie('access_token', token, options);
  }
  return cookie('access_token');
}

// action creator creators
export function load(getFromCookie) {
  const fetchLoad = bind(
    ApiClient.get('/v1/accounts/current/'),
    ({ value }) => loadUserSuccess(value),
    ({ value }) => loadUserFailure(value)
  );
  if (getFromCookie) {
    return [
      loadUser(),
      bind(
        accessTokenCookie(),
        token => bind(
          setToken(token),
          () => fetchLoad
        )
      )
    ];
  }
  return [
    loadUser(),
    fetchLoad
  ];
}

export function refresh(token) {
  return [
    refreshToken(),
    bind(
      ApiClient.post('/v1/auth/refresh/', {
        data: {
          token
        }
      }),
      ({ value }) => bind(
        accessTokenCookie(value.token),
        () => refreshTokenSuccess(value)
      ),
      ({ value }) => refreshTokenFailure(value)
    )
  ];
}

export function login(username, password, callback) {
  return [
    loginUser(),
    bind(
      ApiClient.post('/v1/auth/login/', {
        data: {
          username,
          password
        }
      }),
      ({ value }) => bind(
        accessTokenCookie(value.token),
        () => {
          if (typeof callback === 'function') {
            callback(Promise.resolve(value));
          }
          return loginUserSuccess(value);
        }
      ),
      ({ value }) => bind(
        accessTokenCookie(null),
        () => {
          if (typeof callback === 'function') {
            callback(Promise.reject(value));
          }
          return loginUserFailure(value);
        }
      )
    )
  ];
}

export function update(user, callback) {
  return [
    updateUser(),
    bind(
      ApiClient.put('/v1/accounts/current/', {
        data: { ...user }
      }),
      ({ value }) => {
        if (typeof callback === 'function') {
          callback(Promise.resolve(value));
        }
        return bind(
          updateUserSuccess(value),
          () => timeout(() => setUpdated(false), 3000)
        );
      },
      ({ value }) => {
        if (typeof callback === 'function') {
          callback(Promise.reject(value));
        }
        return updateUserFailure(value);
      }
    )
  ];
}

export function logout() {
  return [
    logoutUser(),
    bind(
      accessTokenCookie(null),
      () => logoutUserSuccess()
    )
  ];
}

const INITIAL_STATE = new UserState();

function clearErrors(initialState) {
  initialState.loadError = null;
  initialState.loginError = null;
  initialState.logoutError = null;
  initialState.refreshTokenError = null;
  initialState.updateError = null;
}

const reducerMap = {};

reducerMap[LOAD] = initialState =>
  initialState.withMutations(state => {
    clearErrors(state);
    state.loading = true;
  });

reducerMap[LOAD_SUCCESS] = (initialState, action) =>
  initialState.withMutations(state => {
    const {
      id,
      username,
      email,
      first_name,
      last_name
    } = action.payload;
    state.loadError = null;
    state.loading = false;
    state.loaded = true;
    state.loggedIn = true;
    state.id = id;
    state.username = username;
    state.email = email;
    state.first_name = first_name;
    state.last_name = last_name;
  });

reducerMap[LOAD_FAILURE] = (initialState, action) =>
  initialState.withMutations(state => {
    state.loadError = action.payload;
    state.loading = false;
    state.loaded = false;
    state.loggedIn = false;
    state.id = null;
    state.username = null;
    state.email = null;
    state.first_name = null;
    state.last_name = null;
  });

reducerMap[LOGIN] = initialState =>
  initialState.withMutations(state => {
    clearErrors(state);
    state.loggingIn = true;
  });

reducerMap[LOGIN_SUCCESS] = (initialState, action) =>
  initialState.withMutations(state => {
    const {
      user: {
        id,
        username,
        email,
        first_name,
        last_name
      },
      token
    } = action.payload;
    const parsedToken = parseToken(token);
    state.loginError = null;
    state.loggingIn = false;
    state.loaded = true;
    state.loggedIn = true;
    state.id = id;
    state.username = username;
    state.email = email;
    state.first_name = first_name;
    state.last_name = last_name;
    state.token = new Token({ ...parsedToken });
  });

reducerMap[LOGIN_FAILURE] = (initialState, action) =>
  initialState.withMutations(state => {
    state.loginError = action.payload;
    state.loggingIn = false;
    state.loaded = false;
    state.loggedIn = false;
    state.id = null;
    state.username = null;
    state.email = null;
    state.first_name = null;
    state.last_name = null;
    state.token = new Token();
  });

reducerMap[LOGOUT] = initialState =>
  initialState.withMutations(state => {
    clearErrors(state);
    state.loggingOut = true;
  });

reducerMap[LOGOUT_SUCCESS] = initialState =>
  initialState.withMutations(state => {
    state.logoutError = null;
    state.loggingOut = false;
    state.loaded = false;
    state.loggedIn = false;
    state.id = null;
    state.username = null;
    state.email = null;
    state.first_name = null;
    state.last_name = null;
    state.token = new Token();
  });

reducerMap[LOGOUT_FAILURE] = (initialState, action) =>
  initialState.withMutations(state => {
    state.logoutError = action.payload;
    state.loggingOut = false;
  });

reducerMap[REFRESH_TOKEN] = initialState =>
  initialState.withMutations(state => {
    clearErrors(state);
    state.refreshingToken = true;
  });

reducerMap[REFRESH_TOKEN_SUCCESS] = (initialState, action) =>
  initialState.withMutations(state => {
    const {
      user: {
        id,
        username,
        email,
        first_name,
        last_name
      },
      token
    } = action.payload;
    const parsedToken = parseToken(token);
    state.refreshTokenError = null;
    state.refreshingToken = false;
    state.id = id;
    state.username = username;
    state.email = email;
    state.first_name = first_name;
    state.last_name = last_name;
    state.token = new Token({ ...parsedToken });
  });

reducerMap[REFRESH_TOKEN_FAILURE] = (initialState, action) =>
  initialState.withMutations(state => {
    state.refreshTokenError = action.payload;
    state.refreshingToken = false;
  });

reducerMap[SET_TOKEN] = (initialState, action) =>
  initialState.withMutations(state => {
    if (action.payload !== undefined) {
      const parsedToken = parseToken(action.payload);
      state.token = new Token({ ...parsedToken });
    }
  });

reducerMap[UPDATE] = initialState =>
  initialState.withMutations(state => {
    clearErrors(state);
    state.updating = true;
    state.updated = false;
  });

reducerMap[UPDATE_SUCCESS] = (initialState, action) =>
  initialState.withMutations(state => {
    const {
      id,
      username,
      email,
      first_name,
      last_name
    } = action.payload;
    state.updateError = null;
    state.updating = false;
    state.updated = true;
    state.id = id;
    state.username = username;
    state.email = email;
    state.first_name = first_name;
    state.last_name = last_name;
  });

reducerMap[UPDATE_FAILURE] = (initialState, action) =>
  initialState.withMutations(state => {
    state.updateError = action.payload;
    state.updating = false;
    state.updated = false;
  });

reducerMap[SET_UPDATED] = (initialState, action) =>
  initialState.withMutations(state => {
    state.updated = action.payload;
  });

export default handleActions(reducerMap, INITIAL_STATE);

