import React from 'react';

const DashHead = ({ children }) => <div className="dashhead">{children}</div>;
DashHead.propTypes = {
  children: React.PropTypes.node.isRequired
};

const DashHeadTitles = ({ children }) => <div className="dashhead-titles">{children}</div>;
DashHeadTitles.propTypes = {
  children: React.PropTypes.node.isRequired
};
export {
  DashHeadTitles
};
export default DashHead;
