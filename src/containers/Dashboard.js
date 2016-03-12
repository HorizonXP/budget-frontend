/* eslint react/prop-types: [2, { ignore: ["store"] }] */
import React from 'react';
import { asyncConnect } from 'redux-async-connect';
import {
  setGroup,
  setTitle
} from 'redux/modules/dashhead';

const Dashboard = () => <h1>Hey!</h1>;

export default asyncConnect([{
  promise: ({ store }) => {
    const promises = [];
    promises.push(store.dispatch(setGroup('Dashboards')));
    promises.push(store.dispatch(setTitle('Overview')));
    return Promise.all(promises);
  }
}])(Dashboard);
