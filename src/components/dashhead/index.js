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
  getEndDate,
  setViewMode,
  getViewMode
} from 'redux/modules/datepicker';
import {
  getGroup,
  getTitle
} from 'redux/modules/dashhead';

@connect(
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
)
export default class DashHeadComponent extends React.Component {
  static propTypes = {
    datepicker: React.PropTypes.object.isRequired,
    dashhead: React.PropTypes.object.isRequired,
    show: React.PropTypes.func.isRequired,
    hide: React.PropTypes.func.isRequired,
    setStartDate: React.PropTypes.func.isRequired,
    setEndDate: React.PropTypes.func.isRequired,
    setViewMode: React.PropTypes.func.isRequired
  }

  render() {
    const startDate = getStartDate(this.props.datepicker);
    const endDate = getEndDate(this.props.datepicker);
    const viewMode = getViewMode(this.props.datepicker);
    const title = getTitle(this.props.dashhead);
    const group = getGroup(this.props.dashhead);
    return (
      <DashHead>
        <DashHeadTitles>
          <h1 className="h6 dashhead-subtitle">{group}</h1>
          <h2 className="h2 dashhead-title">{title}</h2>
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
              setViewMode={this.props.setViewMode}
              viewMode={viewMode}
            />
          </ButtonToolbarItem>
        </ButtonToolbar>
      </DashHead>
    );
  }
}
