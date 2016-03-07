import React from 'react';
import { Input } from 'react-bootstrap';
import ButtonInput from '../../ButtonInput';

const SidebarSearch = ({ onSubmit }) =>
  <form className="sidebar-form" onSubmit={onSubmit}>
    <Input type="text" placeholder="Search..." />
    <ButtonInput type="submit" bsStyle="link">
      <span className="icon icon-magnifying-glass" />
    </ButtonInput>
  </form>;

SidebarSearch.propTypes = {
  onSubmit: React.PropTypes.func.isRequired
};
export default SidebarSearch;
