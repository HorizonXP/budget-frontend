import React from 'react';

const NavHeader = ({ children }) =>
  <li className="nav-header">
    {children}
  </li>;
NavHeader.propTypes = {
  children: React.PropTypes.node.isRequired
};

export default NavHeader;
