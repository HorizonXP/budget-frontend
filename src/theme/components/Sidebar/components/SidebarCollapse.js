import React from 'react';
import { Collapse } from 'react-bootstrap';

export default class SidebarCollapse extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    expanded: React.PropTypes.bool.isRequired,
    toggleBreakpoint: React.PropTypes.string.isRequired
  }

  render() {
    const toggleCls = `nav-toggleable-${this.props.toggleBreakpoint}`;
    return (
      <Collapse in={this.props.expanded}>
        <div className={`${toggleCls}`}>
          {this.props.children}
        </div>
      </Collapse>
    );
  }
}
