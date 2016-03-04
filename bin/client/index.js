require('babel-polyfill');
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { ReduxAsyncConnect } from 'redux-async-connect';
import { syncHistoryWithStore } from 'react-router-redux';

import createStore from '../../src/redux/store/createStore';
import getRoutes from '../../src/routes';
import { fromJSON } from 'transit-immutable-js';

injectTapEventPlugin();

const initialState = fromJSON(window.__data);

const dest = document.getElementById('content');
const store = createStore(browserHistory, null, initialState);
const history = syncHistoryWithStore(browserHistory, store);

const renderProp = props => <ReduxAsyncConnect {...props} filter={item => !item.deferred} />;

const component = (
  <Router render={renderProp} history={history}>
    {getRoutes(store)}
  </Router>
);

ReactDOM.render(
  <Provider store={store} key="provider">
    {component}
  </Provider>,
  dest
);

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger

  if (!dest || !dest.firstChild || !dest.firstChild.attributes ||
      !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that ' +
                  'your initial render does not contain any client-side code.');
  }
}

