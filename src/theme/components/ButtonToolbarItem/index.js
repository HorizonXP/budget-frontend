import React from 'react';

const ButtonToolbarItem = ({ children, className }) =>
  <div className={`btn-toolbar-item ${className !== undefined ? className : ''}`}>{children}</div>;
ButtonToolbarItem.propTypes = {
  children: React.PropTypes.node.isRequired,
  className: React.PropTypes.string.isRequired,
};

export default ButtonToolbarItem;
