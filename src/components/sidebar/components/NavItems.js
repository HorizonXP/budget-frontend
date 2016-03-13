import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import NavDivider from 'theme/components/NavDivider';
import NavHeader from 'theme/components/NavHeader';

const NavItems = props => (
  <Nav {...props}>
    <NavHeader>Dashboards</NavHeader>
    <IndexLinkContainer to="/">
      <NavItem>Overview</NavItem>
    </IndexLinkContainer>
    <LinkContainer to="/accounts">
      <NavItem>Accounts</NavItem>
    </LinkContainer>
    <LinkContainer to="/bills">
      <NavItem>Bills</NavItem>
    </LinkContainer>
    <LinkContainer to="/creditcards">
      <NavItem>Credit Cards</NavItem>
    </LinkContainer>
    <LinkContainer to="/investments">
      <NavItem>Investments</NavItem>
    </LinkContainer>
    <NavDivider />
    <NavHeader>Other</NavHeader>
    <LinkContainer to="/transactions">
      <NavItem>Transactions</NavItem>
    </LinkContainer>
    <LinkContainer to="/taxes">
      <NavItem>Taxes</NavItem>
    </LinkContainer>
    <NavDivider />
    <LinkContainer to="/settings">
      <NavItem>Settings</NavItem>
    </LinkContainer>
    <LinkContainer to="/logout">
      <NavItem>Logout</NavItem>
    </LinkContainer>
    <hr className="visible-xs m-t" />
  </Nav>
);

export default NavItems;
