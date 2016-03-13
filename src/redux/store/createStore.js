import { createStore as _createStore, applyMiddleware } from 'redux';
import reducer from 'redux/modules';
import promisify from 'redux/middleware/promisify';
import effects from 'redux-effects';
import { bearer } from 'redux-effects-credentials';
import headers from 'redux/middleware/headersMiddleware';
import cookie from 'redux-effects-cookie';
import refreshToken from 'redux/middleware/refreshTokenMiddleware';
import fetch from 'redux-effects-fetch';
import multi from 'redux-multi';
import apiUrl from 'redux/middleware/apiUrlMiddleware';
import checkAuth from 'redux/middleware/checkAuth';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';

export default (history, cookies, data) => {
  const reduxRouterMiddleware = routerMiddleware(history);
  const apiPattern = /\/api\//;
  const getToken = state => state.user.token;
  const getTokenVal = state => {
    const tokenObj = state.user.token;
    if (tokenObj) {
      return tokenObj.token;
    }
    return null;
  };
  const middleware = [
    promisify,
    multi,
    effects,
    thunk,
    apiUrl(apiPattern),
    headers(apiPattern),
    bearer(apiPattern, getTokenVal),
    refreshToken(apiPattern, getToken),
    checkAuth,
    fetch,
    cookie(cookies),
    reduxRouterMiddleware,
  ];
  const finalCreateStore = applyMiddleware(...middleware)(_createStore);

  const store = finalCreateStore(reducer, data);

  if (__DEVELOPMENT__ && module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../modules', () => {
      const nextReducer = require('../modules');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
};

