import React from 'react';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';

const MyButton = ({ bsClass, className, pill, outline, ...props }) => {
  const classes = {
    'btn-pill': pill,
    btn: outline && !bsClass
  };
  let bsClassCls = 'btn';
  if (bsClass) {
    bsClassCls = bsClass;
  } else if (outline) {
    bsClassCls = 'btn-outline';
  }
  return (
    <Button
      className={classNames(classes, className)}
      bsClass={bsClassCls}
      {...props}
    />
  );
};

MyButton.propTypes = {
  className: React.PropTypes.string,
  bsClass: React.PropTypes.string,
  pill: React.PropTypes.bool,
  outline: React.PropTypes.bool,
};

export default MyButton;
