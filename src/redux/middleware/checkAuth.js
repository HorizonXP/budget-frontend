import { push } from 'react-router-redux';
import { logout } from 'redux/modules/user';
/**
 * Action types
 */

const FETCH = 'EFFECT_FETCH';
const pattern = /\/api\/v2\/accounts\/current\//;

export default ({ getState, dispatch }) => next => action => {
  const initialState = getState();
  return action.type === FETCH && !pattern.test(action.payload.url)
    ? next(action).catch(res => {
      if (res.status === 401) {
        const nextUrl = initialState.routing.locationBeforeTransitions.pathname;
        dispatch(logout()).then(() => dispatch(push(`/login?next=${nextUrl}`)));
      }
      throw res;
    })
    : next(action);
};
