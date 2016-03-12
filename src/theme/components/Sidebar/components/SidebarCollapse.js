import React from 'react';
import { Collapse } from 'react-bootstrap';

const SidebarCollapse = ({ children, expanded, toggleBreakpoint }) => (
  <Collapse in={expanded}>
    <div className={`nav-toggleable-${toggleBreakpoint}`}>
      {children}
    </div>
  </Collapse>
);

SidebarCollapse.propTypes = {
  children: React.PropTypes.node.isRequired,
  expanded: React.PropTypes.bool.isRequired,
  toggleBreakpoint: React.PropTypes.string.isRequired
};

export default SidebarCollapse;
