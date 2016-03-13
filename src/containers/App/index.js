import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { asyncConnect } from 'redux-async-connect';
import { load as loadAuth } from 'redux/modules/user';

const App = ({ children }) => (
  <div>
    <Helmet
      title="Family Budget Dashboard"
      titleTemplate="Family Budget Dashboard - %s"
    />
    {children}
  </div>
);

App.propTypes = {
  children: PropTypes.node
};

App.contextTypes = {
  store: PropTypes.object
};

export default asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    const promises = [];

    if (!getState().user.loaded) {
      promises.push(dispatch(loadAuth(true)));
    }

    return Promise.all(promises);
  }
}])(App);
