import React from 'react';
import DashHead from 'theme/components/DashHead';
import { DashHeadTitles } from 'theme/components/DashHead';
import ButtonToolbarItem from 'theme/components/ButtonToolbarItem';
import { ButtonToolbar } from 'react-bootstrap';
import DatePicker from 'theme/components/DatePicker';
import { connect } from 'react-redux';
import {
  show,
  hide,
  setStartDate,
  setEndDate,
  setViewMode,
} from 'redux/modules/datepicker';

const DashHeadComponent = ({
  datepicker: {
    startDate,
    endDate,
    shown,
    viewMode
  },
  dashhead: {
    group,
    title
  },
  ...props
}) => (
  <DashHead>
    <DashHeadTitles>
      <h1 className="h6 dashhead-subtitle">{group}</h1>
      <h2 className="h2 dashhead-title">{title}</h2>
    </DashHeadTitles>
    <ButtonToolbar className="dashhead-toolbar">
      <ButtonToolbarItem>
        <DatePicker
          onFocus={props.show}
          onBlur={props.hide}
          show={shown}
          setStartDate={props.setStartDate}
          setEndDate={props.setEndDate}
          startDate={startDate}
          endDate={endDate}
          setViewMode={props.setViewMode}
          viewMode={viewMode}
        />
      </ButtonToolbarItem>
    </ButtonToolbar>
  </DashHead>
);

DashHeadComponent.propTypes = {
  datepicker: React.PropTypes.object.isRequired,
  dashhead: React.PropTypes.object.isRequired,
  show: React.PropTypes.func.isRequired,
  hide: React.PropTypes.func.isRequired,
  setStartDate: React.PropTypes.func.isRequired,
  setEndDate: React.PropTypes.func.isRequired,
  setViewMode: React.PropTypes.func.isRequired
};

export default connect(
  state => (
    {
      datepicker: state.datepicker,
      dashhead: state.dashhead
    }
  ),
  {
    show,
    hide,
    setStartDate,
    setEndDate,
    setViewMode
  }
)(DashHeadComponent);
