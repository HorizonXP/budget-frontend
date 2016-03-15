import React from 'react';

const FlexTable = ({ children }) => (
  <div className="flextable">
    { children }
  </div>
);

FlexTable.propTypes = {
  children: React.PropTypes.node
};

export FlexTableItem from './components/FlexTableItem';
export default FlexTable;
