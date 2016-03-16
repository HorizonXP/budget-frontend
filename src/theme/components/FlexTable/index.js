import React from 'react';
import classnames from 'classnames';

const FlexTable = ({ children, className }) => (
  <div className={classnames(className, 'flextable')}>
    { children }
  </div>
);

FlexTable.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string
};

export FlexTableItem from './components/FlexTableItem';
export default FlexTable;
