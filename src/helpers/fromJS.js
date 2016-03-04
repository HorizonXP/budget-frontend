import { Seq } from 'immutable';

function isPlainObj(value) {
  return value && (value.constructor === Object || value.constructor === undefined);
}

export default function fromJS(json) {
  if (Array.isArray(json)) {
    return new Seq.Indexed(json).map(fromJS).toSet();
  }
  if (isPlainObj(json)) {
    return new Seq.Keyed(json).map(fromJS).toMap();
  }
  return json;
}
