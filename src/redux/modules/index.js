import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-async-connect';
import { combineReducers } from 'redux';
import user from './user';
import sidebar from './sidebar';
import datepicker from './datepicker';
import { reducer as form } from 'redux-form';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  user,
  sidebar,
  datepicker,
  form
});
