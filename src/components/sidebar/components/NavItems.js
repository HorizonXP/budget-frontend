import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import NavDivider from 'theme/components/NavDivider';
import NavHeader from 'theme/components/NavHeader';

export default class NavItems extends React.Component {
  render() {
    return (
      <Nav {...this.props}>
        <NavHeader>Dashboards</NavHeader>
        <LinkContainer to="/">
          <NavItem>Overview</NavItem>
        </LinkContainer>
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
        <hr className="visible-xs m-t" />
      </Nav>
    );
  }
}
