import React from 'react';

const css = require('./FlexTableItem.scss');
const FlexTableItem = ({ children, primary }) => (
  <div className={`flextable-item${primary ? ' flextable-primary' : ''} ${css.formgroup}`}>
    { children }
  </div>
);

FlexTableItem.propTypes = {
  children: React.PropTypes.node,
  primary: React.PropTypes.bool
};

export default FlexTableItem;

