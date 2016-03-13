import { Set, Record } from 'immutable';

export const Token = new Record({
  token: null,
  exp: null,
  orig_iat: null,
}, 'Token');

export const UserState = new Record({
  loaded: false,
  loading: false,
  loadError: null,

  loggedIn: false,
  loggingIn: false,
  loggingOut: false,
  loginError: null,
  logoutError: null,

  refreshingToken: false,
  refreshTokenError: null,

  id: null,
  username: null,
  email: null,
  firstName: null,
  lastName: null,

  token: new Token()
}, 'UserState');

export const FamilyState = new Record({
  loaded: false,
  loading: false,
  loadError: null,
  name: null,
  id: null,
  members: new Set()
}, 'FamilyState');

export const Member = new Record({
  id: null,
  username: null,
  first_name: null,
  last_name: null,
  email: null,
  dependent: false,
  provider: false
}, 'Member');

export const DashHeadState = new Record({
  title: null,
  group: null
}, 'DashHeadState');

export const DatepickerState = new Record({
  shown: false,
  startDate: new Date(),
  endDate: null,
  viewMode: 'calendar'
}, 'DatepickerState');

export const TaxesState = new Record({
  activeTab: null
}, 'TaxesState');

export const SidebarState = new Record({
  collapsed: false
}, 'SidebarState');
