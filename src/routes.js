import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { App, SignedIn, SignedOut, Login, Dashboard } from 'containers';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/user';

export default store => {
  const requireAuth = (nextState, replace, cb) => {
    function checkAuth() {
      const { user } = store.getState();
      const loggedIn = user.has('loggedIn') ? user.get('loggedIn') : false;
      if (!loggedIn) {
        replace({ pathname: '/login', state: { next: nextState.location.pathname } });
      }
      cb();
    }

    if (!isAuthLoaded(store.getState().user)) {
      store.dispatch(loadAuth(true)).then(checkAuth);
    } else {
      checkAuth();
    }
  };
  return (
    <Route component={App}>
      <Route component={SignedOut}>
        <Route path="/login" component={Login} />
      </Route>
      <Route component={SignedIn} onEnter={requireAuth}>
        <Route path="/">
          <IndexRoute component={Dashboard} />
        </Route>
      </Route>
    </Route>
  );
};

