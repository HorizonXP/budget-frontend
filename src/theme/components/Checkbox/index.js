import React from 'react';
import classnames from 'classnames';

const Checkbox = ({ inline, children, ...props }) => {
  const classes = {
    checkbox: !inline,
    'checkbox-inline': inline,
    'custom-control': true,
    'custom-checkbox': true
  };
  return (
    <div className={classnames(classes, props.className)}>
      <label>
        <input type="checkbox" {...props} />
        <span className="custom-control-indicator" />
        { children }
      </label>
    </div>
  );
};

Checkbox.propTypes = {
  className: React.PropTypes.string,
  children: React.PropTypes.node,
  inline: React.PropTypes.bool,
};

export default Checkbox;

