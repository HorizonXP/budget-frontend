/* eslint camelcase: 0 */
import React from 'react';
import { Input, Row, Col, Alert } from 'react-bootstrap';
import { reduxForm } from 'redux-form';
import {
  getValidationErrorProperties,
  validateProfileEditor as validate,
  filterNonFieldErrors
} from 'helpers/validationUtils';
import { update } from 'redux/modules/user';
import ButtonInput from 'theme/components/ButtonInput';
import { Map } from 'immutable';
import DatePicker from 'theme/components/DatePicker';
import { load as loadFamily } from 'redux/modules/family';

export const fields = [
  'first_name',
  'last_name',
  'email',
  'username',
  'birthday',
  'current_password',
  'new_password1',
  'new_password2'
];

const onSubmit = props => e => {
  const {
    handleSubmit,
    resetForm
  } = props;
  const submit = values => {
    const valuesToSubmit = new Map(values).filter(
      value => value !== undefined && value !== null && value !== ''
    ).toJS();
    return new Promise((resolve, reject) =>
      props.update(valuesToSubmit, resolve, filterNonFieldErrors(reject))
    ).then(() => {
      resetForm();
      props.loadFamily();
    });
  };
  handleSubmit(submit)(e);
};

const ProfileEditor = ({
  fields: {
    first_name,
    last_name,
    username,
    birthday,
    email,
    current_password,
    new_password1,
    new_password2
  },
  submitFailed,
  submitting,
  invalid,
  user: { updated },
  dirty,
  error,
  ...props
}) => (
  <form onSubmit={onSubmit(props)}>
    <Row>
      <Col xs={12} sm={6}>
        <Input type="text" label="First Name" name="first_name"
          {...getValidationErrorProperties(first_name)} {...first_name}
        />
      </Col>
      <Col xs={12} sm={6}>
        <Input type="text" label="Last Name" name="last_name"
          {...getValidationErrorProperties(last_name)} {...last_name}
        />
      </Col>
    </Row>
    <Row>
      <Col xs={12} sm={6}>
        <Input type="text" label="E-mail Address" name="email"
          {...getValidationErrorProperties(email)} {...email}
        />
      </Col>
      <Col xs={12} sm={6}>
        <Input type="text" label="Username" name="username"
          {...getValidationErrorProperties(username)} {...username}
        />
      </Col>
    </Row>
    <Row>
      <Col xs={12} sm={6}>
        <DatePicker
          startDate={birthday.initialValue}
          label="Birthday"
          {...getValidationErrorProperties(birthday)}
          {...birthday}
        />
      </Col>
    </Row>
    <Row>
      <Col xs={12} sm={6}>
        <Input type="password"
          name="foilauto_current_password" value="" className="hidden"
          groupClassName="hidden"
        />
        <Input type="password" label="Current Password"
          name="current_password" placeholder="Enter current password"
          {...getValidationErrorProperties(current_password, true)} {...current_password}
        />
      </Col>
      <Col xs={12} sm={6}>
        <Input type="password" label="New Password" name="new_password1"
          placeholder="Enter new password"
          {...getValidationErrorProperties(new_password1, true)} {...new_password1}
        />
      </Col>
    </Row>
    <Row>
      <Col xs={12} sm={6} smOffset={6}>
        <Input type="password" label="Re-enter New Password"
          name="new_password2" placeholder="Re-enter new password"
          {...getValidationErrorProperties(new_password2, true)} {...new_password2}
        />
      </Col>
    </Row>
    <Row>
      <Col xs={12} md={6}>
        { error &&
          <Alert bsStyle="danger">{error}</Alert>
        }
      </Col>
      <Col xs={12} md={3} mdPush={3}>
        <ButtonInput type="submit" bsStyle={updated ? 'success' : 'primary'} block
          disabled={submitting || (invalid && !submitFailed) || !dirty} className="navbar-btn"
        >
          {!submitting && !updated &&
            <span><i className="fa fa-lg fa-fw fa-check" /> Save Changes</span>
          }
          {submitting && !updated &&
            <span><i className="fa fa-lg fa-fw fa-spin fa-spinner" /> Saving...</span>
          }
          {!submitting && updated &&
            <span><i className="fa fa-lg fa-fw fa-check" /> Saved!</span>
          }
        </ButtonInput>
      </Col>
      <Col xs={12} md={3} mdPull={3}>
        <ButtonInput type="button" block className="navbar-btn" onClick={props.resetForm}>
          <i className="fa fa-lg fa-fw fa-refresh" /> Reset
        </ButtonInput>
      </Col>
    </Row>
  </form>
);

ProfileEditor.propTypes = {
  fields: React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  error: React.PropTypes.func.isRequired,
  initializeForm: React.PropTypes.func.isRequired,
  resetForm: React.PropTypes.func.isRequired,
  update: React.PropTypes.func.isRequired,
  loadFamily: React.PropTypes.func.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  dirty: React.PropTypes.bool.isRequired,
  user: React.PropTypes.object.isRequired,
  invalid: React.PropTypes.bool.isRequired
};

export default reduxForm(
  {
    form: 'profileEditor',
    fields,
    validate
  },
  state => {
    const user = state.user;
    const {
      first_name,
      last_name,
      username,
      birthday,
      email
    } = user;
    const initialValues = {
      first_name,
      last_name,
      username,
      birthday,
      email
    };
    return {
      initialValues,
      user
    };
  },
  {
    update,
    loadFamily
  }
)(ProfileEditor);
