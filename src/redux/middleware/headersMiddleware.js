/**
 * Action types
 */

const FETCH = 'EFFECT_FETCH';

export default pattern => ({ getState }) => next => action => {
  function decorate(state, headers = {}) {
    return {
      ...headers,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
  }
  return action.type === FETCH && pattern.test(action.payload.url)
    ? next({
      ...action,
      payload: {
        ...action.payload,
        params: {
          ...action.payload.params,
          headers: decorate(getState(), (action.payload.params || {}).headers)
        }
      }
    }) : next(action);
};
