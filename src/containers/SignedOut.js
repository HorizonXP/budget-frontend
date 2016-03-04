import React from 'react';

class SignedOut extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired
  }
  render() {
    return this.props.children;
  }
}

export default SignedOut;
