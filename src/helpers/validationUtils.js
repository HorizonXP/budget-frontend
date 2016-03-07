/* eslint camelcase: 0 */
/* eslint array-callback-return: 0 */
import validator from 'validator';

validator.required = val => !validator.isNull(val);
validator.notEquals = (str, comparison) => !validator.equals(str, comparison);
validator.hasCurrentPassword =
  (val, pass1, pass2) =>
    (validator.required(pass1) || validator.required(pass2)) ? validator.required(val) : true;

function checkConstraint(value, constraint, params) {
  const funcArgs = typeof params === 'object' ? params.args : [];
  const errorMessage = typeof params === 'object' ? params.msg : params;
  const newValue = value === undefined || value === null ? '' : value;
  return !validator[constraint](newValue, ...funcArgs) ? errorMessage : '';
}

function checkConstraints(values, constraints) {
  const constraintFieldKeys = Object.keys(constraints);
  const result = {};
  constraintFieldKeys.map(constraintFieldKey => {
    const constraint = constraints[constraintFieldKey];
    const constraintKeys = Object.keys(constraint);
    const value = values[constraintFieldKey];
    result[constraintFieldKey] = constraintKeys.reduce((prevErr, constraintKey) => {
      if (prevErr) return prevErr;
      const params = constraint[constraintKey];
      return checkConstraint(value, constraintKey, params);
    }, null);
  });
  return result;
}

export function getValidationErrorProperties(field, ignoreTouch) {
  const touched = !ignoreTouch ? field.touched : true;
  return ({
    hasFeedback: true,
    bsStyle: touched && field.error ? 'error' : null,
    help: touched && field.error ? field.error : ''
  });
}

export function validateProfileEditor(values) {
  const constraints = {
    first_name: {
      required: 'Please enter your first name.'
    },
    last_name: {
      required: 'Please enter your last name.'
    },
    email: {
      required: 'Please enter your e-mail address.',
      isEmail: 'Please enter a valid e-mail address.'
    },
    current_password: {
      hasCurrentPassword: {
        args: [values.new_password1, values.new_password2],
        msg: 'You must enter your current password before you can change it.'
      },
    }
  };
  if (values.current_password) {
    constraints.new_password1 = {
      isLength: {
        args: [6],
        msg: 'Your new password must be 6 characters or longer.'
      },
      notEquals: {
        args: [values.current_password],
        msg: 'Your new password has to be different from your existing password.'
      }
    };
    constraints.new_password2 = {
      equals: {
        args: [values.new_password1],
        msg: 'Your new password entries do not match.'
      }
    };
  }
  return checkConstraints(values, constraints);
}

export function validateLogin(values) {
  const constraints = {
    username: {
      required: 'Please enter your username.',
      isAlphanumeric: 'Please enter a valid username.'
    },
    password: {
      required: 'Please enter your password.'
    }
  };
  return checkConstraints(values, constraints);
}

export function filterNonFieldErrors(errors) {
  const non_field_errors = {};
  if (errors.hasOwnProperty('non_field_errors')) {
    non_field_errors._error = errors.non_field_errors[0];
  } else if (errors.hasOwnProperty('detail')) {
    non_field_errors._error = errors.detail;
  }
  return {
    ...non_field_errors,
    ...errors
  };
}

