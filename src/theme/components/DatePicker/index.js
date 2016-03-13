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

function getYears(year) {
  // Given a year, return an object
  // that describes the years of the decade
  const startDate = moment([year]);
  const firstYear = Math.floor(year / 10) * 10;
  let lastYear = Math.ceil(year / 10) * 10;
  if (firstYear === lastYear) {
    lastYear += 10;
  }
  const firstDay = moment(startDate).startOf('year').set('year', firstYear);
  const lastDay = moment(startDate).endOf('year').set('year', lastYear);
  const prevDecade = moment(firstDay).subtract(1, 'year');
  const nextDecade = moment(lastDay).add(1, 'year');
  const years = [];
  const addYear = (date, old) => {
    const label = date.format('YYYY');
    const yearObj = {
      date,
      label,
      year: years.length + 1,
      old
    };
    years.push(yearObj);
  };
  for (let i = 0; i < firstDay.diff(prevDecade, 'years'); i++) {
    addYear(moment(prevDecade).add(i, 'years'), true);
  }
  for (let i = 0; i < lastDay.diff(firstDay, 'years'); i++) {
    addYear(
      moment(firstDay).add(i, 'years'),
      false
    );
  }
  for (let i = 0; i < nextDecade.diff(lastDay, 'years'); i++) {
    addYear(
      moment(lastDay).add(i, 'years'),
      true
    );
  }
  return years;
}

function startOfDecade(date) {
  const startDate = moment(date);
  const year = startDate.year();
  const firstYear = Math.floor(year / 10) * 10;
  const firstDay = moment(startDate).startOf('year').set('year', firstYear);
  return firstDay;
}

function endOfDecade(date) {
  const startDate = moment(date);
  const year = startDate.year();
  const firstYear = Math.floor(year / 10) * 10;
  let lastYear = Math.ceil(year / 10) * 10;
  if (firstYear === lastYear) {
    lastYear += 10;
  }
  const lastDay = moment(startDate).endOf('year').set('year', lastYear - 1);
  return lastDay;
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
    endDate: React.PropTypes.object,
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
    const years = getYears(currentDate.get('year'));
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
    const nextDecade = () => setStateAndDate(moment(currentDate).add(10, 'year'), false);
    const prevDecade = () => setStateAndDate(moment(currentDate).subtract(10, 'year'), false);
    const next = () => {
      if (viewMode === 'calendar') {
        nextMonth();
      } else if (viewMode === 'month') {
        nextYear();
      } else if (viewMode === 'year') {
        nextDecade();
      }
    };
    const prev = () => {
      if (viewMode === 'calendar') {
        prevMonth();
      } else if (viewMode === 'month') {
        prevYear();
      } else if (viewMode === 'year') {
        prevDecade();
      }
    };
    const switchViewMode = () => {
      let newViewMode = viewMode;
      if (viewMode === 'calendar') {
        newViewMode = 'month';
      } else if (viewMode === 'month') {
        newViewMode = 'year';
      }
      setStateAndDate(currentDate, true, newViewMode);
    };
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
                      { viewMode === 'year' &&
                        `${startOfDecade(currentDate).year()}-${endOfDecade(currentDate).year()}`
                      }
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
                  { viewMode === 'year' &&
                    <tr>
                      <td colSpan={7}>
                        { years.map(year => {
                          const { date, label, old } = year;
                          const key = date.format('DD/MM/YYYY');
                          const active = currentDate.isSame(date, 'year');
                          const activeCls = active ? ' active' : '';
                          const newDate = moment(currentDate).set('year', date.year());
                          const setActive = () => setStateAndDate(newDate, true, 'month');
                          const cls = old ? ' old' : '';
                          return (
                            <span
                              key={key}
                              className={`year${activeCls}${cls}`}
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

