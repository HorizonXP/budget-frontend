import React from 'react';
import SidebarToggle from './components/SidebarToggle';
import SidebarCollapse from './components/SidebarCollapse';
import SidebarSearch from './components/SidebarSearch';

const Sidebar = ({ children }) =>
  <nav className="sidebar-nav">
    {children}
  </nav>;
Sidebar.propTypes = {
  children: React.PropTypes.node.isRequired
};

const Brand = ({ children }) =>
  <span className="sidebar-brand">
    {children}
  </span>;
Brand.propTypes = {
  children: React.PropTypes.node.isRequired
};

const Toggle = SidebarToggle;

const Header = ({ children }) =>
  <div className="sidebar-header">
    {children}
  </div>;
Header.propTypes = {
  children: React.PropTypes.node.isRequired
};

const Collapse = SidebarCollapse;

Sidebar.Brand = Brand;
Sidebar.Toggle = Toggle;
Sidebar.Header = Header;
Sidebar.Collapse = Collapse;
Sidebar.Search = SidebarSearch;

export default Sidebar;
