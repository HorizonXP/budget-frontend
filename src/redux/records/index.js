import { Set, Record } from 'immutable';
import moment from 'moment';

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
  loginError: null,

  loggingOut: false,
  logoutError: null,

  refreshingToken: false,
  refreshTokenError: null,

  updating: false,
  updated: false,
  updateError: null,

  id: null,
  username: null,
  email: null,
  first_name: null,
  last_name: null,

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
  group: null,
  startDate: moment().format('DD/MM/YYYY'),
}, 'DashHeadState');

export const TaxesState = new Record({
  activeTab: null
}, 'TaxesState');

export const SidebarState = new Record({
  collapsed: false
}, 'SidebarState');

export const SettingsState = new Record({
  activeTab: null
}, 'SettingsState');
