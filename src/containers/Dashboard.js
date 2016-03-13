import React from 'react';
import { asyncConnect } from 'redux-async-connect';
import { connect } from 'react-redux';
import Divider from 'theme/components/Divider';
import {
  setGroup,
  setTitle
} from 'redux/modules/dashhead';

const Dashboard = ({ family: { name } }) => (
  <div>
    <Divider className="m-t" />
    <h1>Hey {name}!</h1>
  </div>
);

Dashboard.propTypes = {
  family: React.PropTypes.object.isRequired
};

export default asyncConnect([{
  promise: ({ store }) => {
    const promises = [];
    promises.push(store.dispatch(setGroup('Dashboards')));
    promises.push(store.dispatch(setTitle('Overview')));
    return Promise.all(promises);
  }
}])(
connect(
  state => (
    {
      family: state.family
    }
  ),
)(Dashboard));
