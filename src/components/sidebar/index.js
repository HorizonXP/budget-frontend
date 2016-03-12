import React from 'react';
import { IndexLink } from 'react-router';
import Sidebar from 'theme/components/Sidebar';
import NavItems from './components/NavItems';
import { connect } from 'react-redux';
import { toggle, collapsed } from 'redux/modules/sidebar';

const SidebarMenu = ({ sidebar, ...props }) =>
  (
    <Sidebar>
      <Sidebar.Header>
        <Sidebar.Brand>
          <IndexLink
            className="sidebar-brand img-responsive"
            to="/"
          >
            <span className="fa fa-stack fa-lg text-success sidebar-brand-icon">
              <i className="fa fa-square fa-stack-2x" />
              <i className="fa fa-dollar fa-inverse fa-stack-1x" />
            </span>
          </IndexLink>
        </Sidebar.Brand>
        <Sidebar.Toggle toggleBreakpoint="sm" onClick={props.toggle} />
      </Sidebar.Header>
      <Sidebar.Collapse toggleBreakpoint="sm" expanded={collapsed(sidebar)}>
        <Sidebar.Search />
        <NavItems stacked bsStyle="pills" />
      </Sidebar.Collapse>
    </Sidebar>
  );

SidebarMenu.propTypes = {
  sidebar: React.PropTypes.object.isRequired,
  toggle: React.PropTypes.func.isRequired
};

export default connect(
  state => (
    {
      sidebar: state.sidebar
    }
  ),
  {
    toggle
  }
)(SidebarMenu);
