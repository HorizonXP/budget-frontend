import React from 'react';
import DashHead from 'theme/components/DashHead';
import { DashHeadTitles } from 'theme/components/DashHead';
import ButtonToolbarItem from 'theme/components/ButtonToolbarItem';
import { ButtonToolbar } from 'react-bootstrap';
import DatePicker from 'theme/components/DatePicker';
import { connect } from 'react-redux';
import { setStartDate } from 'redux/modules/dashhead';

const DashHeadComponent = ({
  dashhead: {
    group,
    title,
    startDate
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
          startDate={startDate}
          onChange={props.setStartDate}
        />
      </ButtonToolbarItem>
    </ButtonToolbar>
  </DashHead>
);

DashHeadComponent.propTypes = {
  dashhead: React.PropTypes.object.isRequired,
  setStartDate: React.PropTypes.func.isRequired
};

export default connect(
  state => (
    {
      dashhead: state.dashhead
    }
  ),
  {
    setStartDate,
  }
)(DashHeadComponent);
