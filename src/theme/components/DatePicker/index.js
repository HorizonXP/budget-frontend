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

function getMonths(year) {
  // Given a year, return an object
  // that describes the months of that year
  const startDate = moment([year]);
  const firstDay = moment(startDate).startOf('year');
  const lastDay = moment(startDate).add(1, 'year');
  const months = [];
  for (let i = 0; i < lastDay.diff(firstDay, 'months'); i++) {
    const date = moment(firstDay).add(i, 'months');
    const month = months.length + 1;
    const label = date.format('MMM');
    const monthObj = {
      date,
      label,
      month
    };
    months.push(monthObj);
  }
  return months;
}

export default class DatePicker extends React.Component {
  static propTypes = {
    onFocus: React.PropTypes.func.isRequired,
    onBlur: React.PropTypes.func.isRequired,
    show: React.PropTypes.bool.isRequired,
    setStartDate: React.PropTypes.func.isRequired,
    setEndDate: React.PropTypes.func.isRequired,
    setViewMode: React.PropTypes.func.isRequired,
    startDate: React.PropTypes.object.isRequired,
    endDate: React.PropTypes.object.isRequired,
    viewMode: React.PropTypes.string.isRequired
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
      viewMode
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
    const months = getMonths(currentDate.get('year'));
    const setStateAndDate = (date, setAllowBlur, newViewMode) => {
      this.setState({
        allowBlur: !setAllowBlur,
        value: date.format('DD/MM/YYYY')
      });
      this.props.setStartDate(date.toDate());
      if (newViewMode !== undefined) {
        this.props.setViewMode(newViewMode);
      }
    };
    const nextMonth = () => setStateAndDate(moment(currentDate).add(1, 'month'), false);
    const prevMonth = () => setStateAndDate(moment(currentDate).subtract(1, 'month'), false);
    const nextYear = () => setStateAndDate(moment(currentDate).add(1, 'year'), false);
    const prevYear = () => setStateAndDate(moment(currentDate).subtract(1, 'year'), false);
    const next = () => {
      if (viewMode === 'calendar') {
        nextMonth();
      } else if (viewMode === 'month') {
        nextYear();
      }
    };
    const prev = () => {
      if (viewMode === 'calendar') {
        prevMonth();
      } else if (viewMode === 'month') {
        prevYear();
      }
    };
    const switchViewMode = () => setStateAndDate(currentDate, true, 'month');
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
                      onClick={prev}
                    >
                      «
                    </th>
                    <th
                      colSpan={5}
                      className="datepicker-switch"
                      onClick={switchViewMode}
                    >
                      { viewMode === 'calendar' && currentDate.format('MMMM YYYY') }
                      { viewMode === 'month' && currentDate.format('YYYY') }
                    </th>
                    <th
                      className="next"
                      onClick={next}
                    >
                      »
                    </th>
                  </tr>
                  { viewMode === 'calendar' && <tr>
                      { moment.weekdaysMin().map(day => <th className="dow" key={day}>{day}</th>) }
                    </tr>
                  }
                </thead>
                <tbody>
                  { viewMode === 'calendar' && calendar.map(week =>
                    <tr key={week[0].week}>
                      { week.map(day => {
                        const date = day.date;
                        const key = date.format('DD/MM/YYYY');
                        const str = date.format('D');
                        const active = currentDate.isSame(date, 'day');
                        const cls = day.old ? ' old' : '';
                        const activeCls = active ? ' active' : '';
                        const setActive = () => setStateAndDate(date, day.old, 'calendar');
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
                  { viewMode === 'month' &&
                    <tr>
                      <td colSpan={7}>
                        { months.map(month => {
                          const { date, label } = month;
                          const key = date.format('DD/MM/YYYY');
                          const active = currentDate.isSame(date, 'month');
                          const activeCls = active ? ' active' : '';
                          const newDate = moment(currentDate).set('month', date.month());
                          const setActive = () => setStateAndDate(newDate, true, 'calendar');
                          return (
                            <span
                              key={key}
                              className={`month${activeCls}`}
                              onClick={setActive}
                            >
                              {label}
                            </span>
                          );
                        })}
                      </td>
                    </tr>
                  }
                </tbody>
              </Table>
            </div>
          </div>
        </Overlay>
      </span>
    );
  }
}

