import React from 'react';

const ButtonToolbarItem = ({ children, className }) =>
  <div className={`btn-toolbar-item ${className}`}>{children}</div>;

ButtonToolbarItem.propTypes = {
  children: React.PropTypes.node.isRequired,
  className: React.PropTypes.string,
};

export default ButtonToolbarItem;
