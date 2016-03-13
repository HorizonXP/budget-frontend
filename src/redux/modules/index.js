import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-async-connect';
import { combineReducers } from 'redux';
import user from './user';
import sidebar from './sidebar';
import datepicker from './datepicker';
import dashhead from './dashhead';
import taxes from './taxes';
import family from './family';
import { reducer as form } from 'redux-form';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  user,
  sidebar,
  datepicker,
  taxes,
  family,
  dashhead,
  form
});
