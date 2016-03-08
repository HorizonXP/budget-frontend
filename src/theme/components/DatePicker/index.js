import React from 'react';
import ReactDOM from 'react-dom';
import { Overlay, Table } from 'react-bootstrap';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import { throttle } from 'underscore';
import moment from 'moment';

function getCalendar(year, month) {
  // Given a year and month, return an object
  // that describes the calendar for that month
  const startDate = moment([year, month]);
  const firstDay = moment(startDate).startOf('month');
  const lastDay = moment(startDate).endOf('month');
  const dayInPrevMonth = moment(firstDay).subtract(firstDay.day(), 'days');
  const dayInNextMonth = moment(lastDay).add(6 - lastDay.day(), 'days');
  const weeks = [];
  let days = [];
  const addDayToWeek = (day, old) => {
    const dayObj = {
      date: day,
      old,
      week: weeks.length + 1
    };
    days.push(dayObj);
    if (days.length === 7) {
      weeks.push(days);
      days = [];
    }
  };
  for (let i = 0; i < firstDay.diff(dayInPrevMonth, 'days'); i++) {
    addDayToWeek(
      moment(dayInPrevMonth).add(i, 'days'),
      true
    );
  }
  for (let i = 0; i <= lastDay.diff(firstDay, 'days'); i++) {
    addDayToWeek(
      moment(firstDay).add(i, 'days'),
      false
    );
  }
  for (let i = 1; i <= dayInNextMonth.diff(lastDay, 'days'); i++) {
    addDayToWeek(
      moment(lastDay).add(i, 'days'),
      true
    );
  }
  return weeks;
}

export default class DatePicker extends React.Component {
  static propTypes = {
    onFocus: React.PropTypes.func.isRequired,
    onBlur: React.PropTypes.func.isRequired,
    show: React.PropTypes.bool.isRequired,
    setStartDate: React.PropTypes.func.isRequired,
    setEndDate: React.PropTypes.func.isRequired,
    startDate: React.PropTypes.object.isRequired,
    endDate: React.PropTypes.object.isRequired
  }

  state = {
    allowBlur: true,
    value: null
  }

  componentDidMount() {
    if (canUseDOM) {
      window.addEventListener('resize', this.handleResize);
      document.addEventListener('click', this.maybeBlurClick);
    }
  }

  componentWillUnmount() {
    if (canUseDOM) {
      window.removeEventListener('resize', this.handleResize);
      document.removeEventListener('click', this.maybeBlurClick);
    }
  }

  handleResize = throttle(() => {
    if (canUseDOM) {
      this.forceUpdate();
    }
  }, 500)

  maybeBlur = e => {
    if (this.state.allowBlur) {
      this.props.onBlur(e);
    }
  }

  preventBlur = () => {
    this.setState({
      allowBlur: false
    });
  }

  maybeBlurClick = e => {
    const parent = ReactDOM.findDOMNode(this.refs.datepicker);
    if (!parent.contains(e.target)) {
      this.maybeBlur(e);
      this.allowBlur();
    }
  }

  allowBlur = () => {
    this.setState({
      allowBlur: true
    });
  }

  handleChange = e => {
    const date = moment(e.target.value, 'DD/MM/YYYY');
    this.props.setStartDate(date.toDate());
    this.setState({
      value: e.target.value
    });
  }

  render() {
    const {
      onFocus,
      show,
      startDate,
    } = this.props;
    const css = require('./DatePicker.scss');
    const baseCls = 'datepicker datepicker-dropdown dropdown-menu'
      + ' datepicker-orient-left datepicker-orient-top';
    const targetFunc = () => ReactDOM.findDOMNode(this.refs.target);
    const currentDate = moment(startDate);
    const currentDateStr = currentDate.format('DD/MM/YYYY');
    const value = this.state.value === null
      ? currentDateStr
      : this.state.value;
    const calendar = getCalendar(currentDate.get('year'), currentDate.get('month'));
    const setStateAndDate = (date, setAllowBlur) => {
      this.setState({
        allowBlur: !setAllowBlur,
        value: date.format('DD/MM/YYYY')
      });
      this.props.setStartDate(date.toDate());
    };
    const nextMonth = () => setStateAndDate(moment(currentDate).add(1, 'month'), false);
    const prevMonth = () => setStateAndDate(moment(currentDate).subtract(1, 'month'), false);
    return (
      <span
        className="input-with-icon"
        ref="datepicker"
      >
        <input
          type="text"
          value={value}
          className="form-control"
          ref="target"
          onFocus={onFocus}
          onBlur={this.maybeBlur}
          onChange={this.handleChange}
        />
        <span className="icon icon-calendar" />
        <Overlay
          target={targetFunc}
          show={show}
          placement="bottom"
          container={this}
          shouldUpdatePosition
        >
          <div
            className={`${css.overlay} ${baseCls} show`}
            onMouseDown={this.preventBlur}
            onMouseUp={this.allowBlur}
          >
            <div className="datepicker-days show">
              <Table condensed className={`${css.table}`}>
                <thead>
                  <tr>
                    <th
                      className="prev"
                      onClick={prevMonth}
                    >
                      «
                    </th>
                    <th colSpan={5} className="datepicker-switch">
                      {currentDate.format('MMMM YYYY')}
                    </th>
                    <th
                      className="next"
                      onClick={nextMonth}
                    >
                      »
                    </th>
                  </tr>
                  <tr>
                    { moment.weekdaysMin().map(day => <th className="dow" key={day}>{day}</th>) }
                  </tr>
                </thead>
                <tbody>
                  { calendar.map(week =>
                    <tr>
                      { week.map(day => {
                        const date = day.date;
                        const key = date.format('DD/MM/YYYY');
                        const str = date.format('D');
                        const active = currentDate.isSame(date, 'day');
                        const cls = day.old ? ' old' : '';
                        const activeCls = active ? ' active' : '';
                        const setActive = () => setStateAndDate(date, day.old);
                        return (
                          <td
                            className={`day${cls}${activeCls}`}
                            key={key}
                            onClick={setActive}
                          >
                            {str}
                          </td>
                        );
                      })}
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </Overlay>
      </span>
    );
  }
}

