import { Set, Record } from 'immutable';

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

