import { refresh as refreshToken } from '../modules/user';

/**
 * Action types
 */

const FETCH = 'EFFECT_FETCH';

export default (pattern, getToken) => ({ dispatch, getState }) => next => action => {
  const token = getToken(getState());
  if (token) {
    const delta = ((new Date()).getTime() / 1000) - token.get('exp');
    const refreshing = getState().user.get('refreshingToken');
    if (action.type === FETCH && pattern.test(action.payload.url) && delta < 300 && !refreshing) {
      return Promise.resolve(dispatch(refreshToken(token.get('token')))).then(() => next(action));
    }
    return next(action);
  }
  return next(action);
};
