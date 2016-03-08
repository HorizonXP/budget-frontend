import React from 'react';
import DashHead from 'theme/components/DashHead';
import { DashHeadTitles } from 'theme/components/DashHead';
import ButtonToolbarItem from 'theme/components/ButtonToolbarItem';
import { ButtonToolbar } from 'react-bootstrap';

export default class DashHeadComponent extends React.Component {
  render() {
    return (
      <DashHead>
        <DashHeadTitles>
          <h1 className="h6 dashhead-subtitle">Dashboards</h1>
          <h2 className="h2 dashhead-title">Overview</h2>
        </DashHeadTitles>
        <ButtonToolbar className="dashhead-toolbar">
          <ButtonToolbarItem className="input-with-icon">
            <input type="text" value="01/01/15 - 01/08/15" className="form-control" />
            <span className="icon icon-calendar" />
          </ButtonToolbarItem>
        </ButtonToolbar>
      </DashHead>
    );
  }
}
