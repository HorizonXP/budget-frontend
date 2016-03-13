import React from 'react';
import { connect } from 'react-redux';
import { logout } from 'redux/modules/user';
import { replace } from 'react-router-redux';

@connect(
  null,
  {
    logout,
    replace
  }
)
export default class Logout extends React.Component {
  static propTypes = {
    logout: React.PropTypes.func.isRequired,
    replace: React.PropTypes.func.isRequired
  };
  componentWillMount() {
    this.props.logout();
    this.props.replace('/login');
  }
  render() {
    return null;
  }
}

