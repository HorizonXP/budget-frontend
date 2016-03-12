import React from 'react';

const SignedOut = ({ children }) => children;

SignedOut.propTypes = {
  children: React.PropTypes.node.isRequired
};

export default SignedOut;
