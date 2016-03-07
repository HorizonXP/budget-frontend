import React from 'react';

export default class SidebarToggle extends React.Component {
  static propTypes = {
    toggleBreakpoint: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired
  }
  render() {
    const toggleCls = `nav-toggler-${this.props.toggleBreakpoint}`;
    return (
      <button
        type="button"
        onClick={this.props.onClick}
        className={`nav-toggler ${toggleCls} sidebar-toggler`}
      >
        <span className="sr-only">Toggle nav</span>
      </button>
    );
  }
}

