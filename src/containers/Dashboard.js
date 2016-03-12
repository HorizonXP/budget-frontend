/* eslint react/prop-types: [2, { ignore: ["store"] }] */
import React from 'react';
import { asyncConnect } from 'redux-async-connect';
import Divider from 'theme/components/Divider';
import {
  setGroup,
  setTitle
} from 'redux/modules/dashhead';

const Dashboard = () => (
  <div>
    <Divider className="m-t" />
    <h1>Hey!</h1>;
  </div>
);

export default asyncConnect([{
  promise: ({ store }) => {
    const promises = [];
    promises.push(store.dispatch(setGroup('Dashboards')));
    promises.push(store.dispatch(setTitle('Overview')));
    return Promise.all(promises);
  }
}])(Dashboard);
