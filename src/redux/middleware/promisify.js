/**
 * Action types
 */

export default () => next => action =>
  Array.isArray(action) ?
    Promise.all(next(action)) :
    next(action);
