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
  isShown,
  setStartDate,
  getStartDate,
  setEndDate,
  getEndDate
} from 'redux/modules/datepicker';

@connect(
  state => (
    {
      datepicker: state.datepicker
    }
  ),
  {
    show,
    hide,
    setStartDate,
    setEndDate
  }
)
export default class DashHeadComponent extends React.Component {
  static propTypes = {
    datepicker: React.PropTypes.object.isRequired,
    show: React.PropTypes.func.isRequired,
    hide: React.PropTypes.func.isRequired,
    setStartDate: React.PropTypes.func.isRequired,
    setEndDate: React.PropTypes.func.isRequired
  }

  render() {
    const startDate = getStartDate(this.props.datepicker);
    const endDate = getEndDate(this.props.datepicker);
    return (
      <DashHead>
        <DashHeadTitles>
          <h1 className="h6 dashhead-subtitle">Dashboards</h1>
          <h2 className="h2 dashhead-title">Overview</h2>
        </DashHeadTitles>
        <ButtonToolbar className="dashhead-toolbar">
          <ButtonToolbarItem>
            <DatePicker
              onFocus={this.props.show}
              onBlur={this.props.hide}
              show={isShown(this.props.datepicker)}
              setStartDate={this.props.setStartDate}
              setEndDate={this.props.setEndDate}
              startDate={startDate}
              endDate={endDate}
            />
          </ButtonToolbarItem>
        </ButtonToolbar>
      </DashHead>
    );
  }
}
