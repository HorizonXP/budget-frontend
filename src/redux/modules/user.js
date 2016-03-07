import { Map } from 'immutable';
import { handleActions, createAction } from 'redux-actions';
import parseToken from 'helpers/parseToken';
import { bind } from 'redux-effects';
import { cookie } from 'redux-effects-cookie';
import ApiClient from 'helpers/ApiClient';

// action constants
const LOAD = 'budget/user/LOAD';
const LOAD_SUCCESS = 'budget/user/LOAD_SUCCESS';
const LOAD_FAILURE = 'budget/user/LOAD_FAILURE';

const LOGIN = 'budget/user/LOGIN';
const LOGIN_SUCCESS = 'budget/user/LOGIN_SUCCESS';
const LOGIN_FAILURE = 'budget/user/LOGIN_FAILURE';

const LOGOUT = 'budget/user/LOGOUT';
export const LOGOUT_SUCCESS = 'budget/user/LOGOUT_SUCCESS';
const LOGOUT_FAILURE = 'budget/user/LOGOUT_FAILURE';

const REFRESH_TOKEN = 'budget/user/REFRESH_TOKEN';
const REFRESH_TOKEN_SUCCESS = 'budget/user/REFRESH_TOKEN_SUCCESS';
const REFRESH_TOKEN_FAILURE = 'budget/user/REFRESH_TOKEN_FAILURE';

const UPDATE_PROFILE = 'budget/user/UPDATE_PROFILE';
const UPDATE_PROFILE_SUCCESS = 'budget/user/UPDATE_PROFILE_SUCCESS';
const UPDATE_PROFILE_FAILURE = 'budget/user/UPDATE_PROFILE_FAILURE';

const SET_SAVED_UPDATE_PROFILE = 'budget/user/SET_SAVED_UPDATE_PROFILE';
const SET_TOKEN = 'budget/user/SET_TOKEN';

// action creators
const loadUser = createAction(LOAD);
const loadUserSuccess = createAction(LOAD_SUCCESS);
const loadUserFailure = createAction(LOAD_FAILURE);

const loginUser = createAction(LOGIN);
const loginUserSuccess = createAction(LOGIN_SUCCESS);
const loginUserFailure = createAction(LOGIN_FAILURE);

const logoutUser = createAction(LOGOUT);
const logoutUserSuccess = createAction(LOGOUT_SUCCESS);

const refreshToken = createAction(REFRESH_TOKEN);
const refreshTokenSuccess = createAction(REFRESH_TOKEN_SUCCESS);
const refreshTokenFailure = createAction(REFRESH_TOKEN_FAILURE);

const updateUserProfile = createAction(UPDATE_PROFILE);
const updateUserProfileSuccess = createAction(UPDATE_PROFILE_SUCCESS);
const updateUserProfileFailure = createAction(UPDATE_PROFILE_FAILURE);

const setToken = createAction(SET_TOKEN);

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
    ApiClient.get('/v2/accounts/current/'),
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
      ApiClient.post('/v2/auth/refresh/', {
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
      ApiClient.post('/v2/auth/login/', {
        data: {
          username,
          password
        }
      }),
      ({ value }) => bind(
        accessTokenCookie(value.token),
        () => bind(
          loginUserSuccess(value),
          () => typeof callback === 'function' ? callback(Promise.resolve(value)) : null
        )
      ),
      ({ value }) => bind(
        accessTokenCookie(null),
        () => bind(
          loginUserFailure(value),
          () => typeof callback === 'function' ? callback(Promise.reject(value)) : null
        )
      )
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

export function submitUpdateUserProfile(values, onSuccess, onFail) {
  return [
    updateUserProfile(),
    bind(
      ApiClient.put('/v2/accounts/current/', {
        data: values
      }),
      ({ value }) => {
        onSuccess(value);
        return updateUserProfileSuccess(value);
      },
      ({ value }) => {
        onFail(value);
        return updateUserProfileFailure(value);
      }
    )
  ];
}

export const INITIAL_STATE = new Map({
  loaded: false,
  loggedIn: false,
  updatedUserProfile: false,

  loading: false,
  loggingIn: false,
  loggingOut: false,
  refreshingToken: false,
  updatingUserProfile: false,

  username: null,
  userID: null,
  firstName: null,
  lastName: null,

  token: new Map({
    token: null,
    exp: null,
    orig_iat: null,
  }),

  // errors
  loadError: null,
  loginError: null,
  logoutError: null,
  refreshTokenError: null,
  updateUserProfileError: null,
});

function setLoggedInState(oldState, state) {
  return oldState.set('loggedIn', state);
}

function setLoggingInState(oldState, state) {
  return oldState.set('loggingIn', state);
}

function setLoggingOutState(oldState, state) {
  return oldState.set('loggingOut', state);
}

function setRefreshingTokenState(oldState, state) {
  return oldState.set('refreshingToken', state);
}

function setUpdatingUserProfile(oldState, state) {
  return oldState.set('updatingUserProfile', state);
}

function setUpdatedUserProfile(oldState, state) {
  return oldState.set('updatedUserProfile', state);
}

function setLoadingError(oldState, error) {
  return oldState.set('loadError', error);
}

function setLoginError(oldState, error) {
  return oldState.set('loginError', error);
}

function setLogoutError(oldState, error) {
  return oldState.set('logoutError', error);
}

function setUpdateUserProfileError(oldState, error) {
  return oldState.set('updateUserProfileError', error);
}

function setRefreshTokenError(oldState, error) {
  return oldState.set('refreshTokenError', error);
}

function clearErrors(oldState) {
  let newState = setLoadingError(oldState, null);
  newState = setLoginError(newState, null);
  newState = setLogoutError(newState, null);
  newState = setUpdateUserProfileError(newState, null);
  newState = setRefreshTokenError(newState, null);
  return newState;
}

function setLoadingState(oldState, state) {
  return oldState.set('loading', state);
}

function setLoadedState(oldState, state) {
  return oldState.set('loaded', state);
}

export function isLoaded(state) {
  return state.get('loaded');
}

function setFirstName(oldState, firstName) {
  return oldState.set('firstName', firstName);
}

function setLastName(oldState, lastName) {
  return oldState.set('lastName', lastName);
}

function setUsername(oldState, username) {
  return oldState.set('username', username);
}

function setUserID(oldState, userID) {
  return oldState.set('userID', userID);
}

function setTokenDetails(oldState, token, origIat, exp) {
  const tokenMap = new Map({
    token,
    orig_iat: origIat,
    exp
  });
  return oldState.set('token', tokenMap);
}

function populateUserFromJSON(oldState, userJson) {
  const { first_name, last_name, username, id } = userJson;
  let newState = setFirstName(oldState, first_name);
  newState = setLastName(newState, last_name);
  newState = setUsername(newState, username);
  newState = setUserID(newState, id);
  return newState;
}

function populateTokenFromJSON(oldState, tokenJson) {
  const { token, orig_iat, exp } = tokenJson;
  const newState = setTokenDetails(oldState, token, orig_iat, exp);
  return newState;
}

function clearUserDetails(oldState) {
  let newState = setFirstName(oldState, null);
  newState = setLastName(newState, null);
  newState = setUsername(newState, null);
  newState = setUserID(newState, null);
  return newState;
}

function clearToken(oldState) {
  const newState = setTokenDetails(oldState, null, null, null, null);
  return newState;
}

const reducerMap = {};

reducerMap[LOAD] = state => {
  let newState = clearErrors(state);
  newState = setLoadingState(newState, true);
  return newState;
};

reducerMap[LOAD_SUCCESS] = (state, action) => {
  let newState = setLoadingError(state, null);
  newState = setLoadingState(newState, false);
  newState = setLoadedState(newState, true);
  newState = populateUserFromJSON(newState, action.payload);
  newState = setLoggedInState(newState, true);
  return newState;
};

reducerMap[LOAD_FAILURE] = (state, action) => {
  let newState = setLoadingError(state, action.payload);
  newState = setLoadingState(newState, false);
  newState = setLoadedState(newState, false);
  newState = setLoggedInState(newState, false);
  newState = clearUserDetails(newState);
  return newState;
};

reducerMap[LOGIN] = state => {
  let newState = clearErrors(state);
  newState = setLoggingInState(newState, true);
  return newState;
};

reducerMap[LOGIN_SUCCESS] = (state, action) => {
  const { user, token } = action.payload;
  const parsedToken = parseToken(token);
  let newState = setLoginError(state, null);
  newState = setLoggingInState(newState, false);
  newState = setLoggedInState(newState, true);
  newState = setLoadedState(newState, true);
  newState = populateUserFromJSON(newState, user);
  newState = populateTokenFromJSON(newState, parsedToken);
  return newState;
};

reducerMap[LOGIN_FAILURE] = (state, action) => {
  let newState = setLoginError(state, action.payload);
  newState = setLoggingInState(newState, false);
  newState = setLoggedInState(newState, false);
  newState = setLoadedState(newState, false);
  newState = clearUserDetails(newState);
  newState = clearToken(newState);
  return newState;
};

reducerMap[LOGOUT] = state => {
  let newState = clearErrors(state);
  newState = setLoggingOutState(newState, true);
  return newState;
};

reducerMap[LOGOUT_SUCCESS] = state => {
  let newState = setLogoutError(state, null);
  newState = setLoggingOutState(newState, false);
  newState = setLoggedInState(newState, false);
  newState = setLoadedState(newState, false);
  newState = clearUserDetails(newState);
  newState = clearToken(newState);
  return newState;
};

reducerMap[LOGOUT_FAILURE] = (state, action) => {
  let newState = setLogoutError(state, action.payload);
  newState = setLoggingOutState(newState, false);
  return newState;
};

reducerMap[REFRESH_TOKEN] = state => {
  let newState = clearErrors(state);
  newState = setRefreshingTokenState(newState, true);
  return newState;
};

reducerMap[REFRESH_TOKEN_SUCCESS] = (state, action) => {
  const { user, token } = action.payload;
  const parsedToken = parseToken(token);
  let newState = setRefreshTokenError(state, null);
  newState = setRefreshingTokenState(newState, false);
  newState = populateUserFromJSON(newState, user);
  newState = populateTokenFromJSON(newState, parsedToken);
  return newState;
};

reducerMap[REFRESH_TOKEN_FAILURE] = (state, action) => {
  let newState = setRefreshTokenError(state, action.payload);
  newState = setRefreshingTokenState(newState, false);
  return newState;
};

reducerMap[SET_TOKEN] = (state, action) => {
  if (action.payload !== undefined) {
    const token = action.payload;
    const parsedToken = parseToken(token);
    const newState = populateTokenFromJSON(state, parsedToken);
    return newState;
  }
  return state;
};

reducerMap[UPDATE_PROFILE] = state => {
  let newState = setUpdatingUserProfile(state, true);
  newState = setUpdateUserProfileError(newState, null);
  return newState;
};

reducerMap[UPDATE_PROFILE_SUCCESS] = (state, action) => {
  let newState = setUpdatingUserProfile(state, false);
  newState = setUpdatedUserProfile(newState, true);
  newState = populateUserFromJSON(newState, action.payload);
  return newState;
};

reducerMap[UPDATE_PROFILE_FAILURE] = (state, action) => {
  let newState = setUpdatingUserProfile(state, false);
  newState = setUpdateUserProfileError(newState, action.payload);
  return newState;
};

reducerMap[SET_SAVED_UPDATE_PROFILE] = (state, action) => {
  const newState = setUpdatedUserProfile(state, action.payload);
  return newState;
};

export default handleActions(reducerMap, INITIAL_STATE);
