import Express from 'express';
import Helmet from 'react-helmet';

import createStore from '../../src/redux/store/createStore';
import getRoutes from '../../src/routes';
import parseToken from '../../src/helpers/parseToken';

import React from 'react';
import ReactDOM from 'react-dom/server';
import { Provider } from 'react-redux';
import { match, createMemoryHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';
import bodyParser from 'body-parser';
import qs from 'query-string';
import { toJSON } from 'transit-immutable-js';
import cookieParser from 'cookie-parser';
import {Map} from 'immutable';
import compression from 'compression';
import path from 'path';
import httpProxy from 'http-proxy';
import Html from '../../src/helpers/Html';

const app = new Express();
const port = 3000;
const address = '0.0.0.0';

// Use this middleware to set up hot module reloading via webpack.
app.use(compression());

if (process.env.NODE_ENV !== 'production') {
  //expose public folder as static assets
  app.use('/static/frontend', Express.static(path.join(__dirname, '..', '..', 'src', 'assets')));
  const proxy = httpProxy.createProxyServer({
    target: 'http://localhost:8000/api',
  });
  app.use('/api', (req, res) => {
    proxy.web(req, res);
  });
  const mediaProxy = httpProxy.createProxyServer({
    target: 'http://localhost:8000/media',
  });
  app.use('/media', (req, res) => {
    mediaProxy.web(req, res);
  });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser())

app.use(function(req, res, next) {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }
  const memoryHistory = createMemoryHistory(req.url);
  req.store = createStore(memoryHistory, req.cookies);
  const history = syncHistoryWithStore(memoryHistory, req.store);
  match({ history, routes: getRoutes(req.store), location: req.url }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      const next = redirectLocation.state.next ? `?next=${redirectLocation.state.next}` + (redirectLocation.search ? `&${redirectLocation.search}` : "") : "";
      return res.redirect(redirectLocation.pathname + next);
    } else if (error) {
      return res.status(500).send("Server Error: " + '<br/>' + error.stack);
    } else if (renderProps) {
      loadOnServer({...renderProps, store: req.store}).then( () => {
        const component = (
          <Provider store={req.store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        );

        res.status(200);
        global.navigator = {userAgent: req.headers['user-agent']};
        for (const key in req.cookies) {
          let options = {};
          if (key == 'access_token') {
            const token = req.cookies[key];
            if (token) {
              const tokenObj = parseToken(token);
              if (tokenObj) {
                options['expires'] = (new Date(tokenObj.exp*1000));
              }
            }
          }
          res.cookie(key, req.cookies[key], options);
        }
        res.send('<!doctype html>\n' + ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={req.store}/>));
      });
    } else {
      // 404
      return res.status(404).send("Page not found.");
    }
  });
});

const server = app.listen(port, address, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
  }
});

