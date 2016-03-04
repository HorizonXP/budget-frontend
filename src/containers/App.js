import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { asyncConnect } from 'redux-async-connect';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/user.js';

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    const promises = [];

    if (!isAuthLoaded(getState().user)) {
      promises.push(dispatch(loadAuth(true)));
    }

    return Promise.all(promises);
  }
}])
export default class App extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    store: PropTypes.object
  }

  static contextTypes = {
    store: PropTypes.object
  }

  render() {
    return (
      <div className="full-height">
        <Helmet
          title="Family Budget Dashboard"
          titleTemplate="Family Budget Dashboard - %s"
        />
        {this.props.children}
      </div>
    );
  }
}
