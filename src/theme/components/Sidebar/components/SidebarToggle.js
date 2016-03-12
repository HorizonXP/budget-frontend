import React from 'react';

const SidebarToggle = ({ toggleBreakpoint, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`nav-toggler nav-toggler-${toggleBreakpoint} sidebar-toggler`}
  >
    <span className="sr-only">Toggle nav</span>
  </button>
);

SidebarToggle.propTypes = {
  toggleBreakpoint: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired
};

export default SidebarToggle;
