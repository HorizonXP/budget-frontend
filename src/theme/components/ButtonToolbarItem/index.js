import React from 'react';
import classnames from 'classnames';

const ButtonToolbarItem = ({ children, className }) =>
  <div className={classnames(className, 'btn-toolbar-item')}>{children}</div>;

ButtonToolbarItem.propTypes = {
  children: React.PropTypes.node.isRequired,
  className: React.PropTypes.string,
};

export default ButtonToolbarItem;
