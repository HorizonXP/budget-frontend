/**
 * Action types
 */

const FETCH = 'EFFECT_FETCH';

export default pattern => () => next => action => {
  function parseUrl(url) {
    if (__SERVER__) {
      // Prepend host and port of the API server to the path.
      const host = process.env.BASE_HOST !== undefined ? `http://${process.env.BASE_HOST}` : 'http://localhost:3000';
      return `${host}${url}`;
    }
    return url;
  }
  return action.type === FETCH && pattern.test(action.payload.url)
    ? next({
      ...action,
      payload: {
        ...action.payload,
        url: parseUrl(action.payload.url)
      }
    }) : next(action);
};
