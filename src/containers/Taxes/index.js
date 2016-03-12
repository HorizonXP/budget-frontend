/* eslint react/prop-types: [2, { ignore: ["store"] }] */
import React from 'react';
import { asyncConnect } from 'redux-async-connect';
import {
  setGroup,
  setTitle
} from 'redux/modules/dashhead';

@asyncConnect([{
  promise: ({ store }) => {
    const promises = [];
    promises.push(store.dispatch(setGroup('Other')));
    promises.push(store.dispatch(setTitle('Taxes')));
    return Promise.all(promises);
  }
}])
export default class TaxesDashboard extends React.Component {
  render() {
    return (
      <h1> Boo </h1>
    );
  }
}
