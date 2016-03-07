import React from 'react';
import { Panel, Input, ButtonInput, Alert } from 'react-bootstrap';
import { reduxForm } from 'redux-form';
import { login } from 'redux/modules/user';
import {
  getValidationErrorProperties,
  validateLogin as validate,
  filterNonFieldErrors
} from 'helpers/validationUtils';

export const fields = ['username', 'password'];

@reduxForm(
  {
    form: 'login',
    fields,
    validate
  },
  state => (
    {
      user: state.user,
      routing: state.routing
    }
  ),
  {
    login
  }
)
export default class LoginBox extends React.Component {
  static propTypes = {
    fields: React.PropTypes.object.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired,
    routing: React.PropTypes.object.isRequired,
    resetForm: React.PropTypes.func.isRequired,
    login: React.PropTypes.func.isRequired,
    submitting: React.PropTypes.bool.isRequired,
    onLogin: React.PropTypes.func,
    error: React.PropTypes.string
  }

  static defaultProps = {
    onLogin: () => null
  }

  onSubmit = values => new Promise((resolve, reject) => {
    const callback = promise => {
      promise
        .then(userJson => resolve(userJson))
        .then(this.props.onLogin)
        .catch(errors => reject(filterNonFieldErrors(errors)));
    };
    this.props.login(values.username, values.password, callback);
  })

  render() {
    const {
      fields: { username, password },
      handleSubmit,
      error
    } = this.props;
    const header = <h1 className="h2">Login</h1>;
    return (
      <Panel header={header} bsStyle="primary">
        <div className="text-center p-b">
          <span className="fa fa-stack fa-3x text-success">
            <i className="fa fa-square fa-stack-2x" />
            <i className="fa fa-dollar fa-inverse fa-stack-1x" />
          </span>
          <h2 className="h3">Family Budget Dashboard</h2>
        </div>
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <Input type="text" placeholder="Username" label="Username"
            ref="username" name="username" labelClassName="sr-only" required autofocus
            {...getValidationErrorProperties(username)} {...username}
          />
          <Input type="password" placeholder="Password" label="Password"
            ref="password" name="password" labelClassName="sr-only" required
            {...getValidationErrorProperties(password)} {...password}
          />
          <ButtonInput type="submit" bsStyle="primary" block>
            Login
          </ButtonInput>
          { error &&
            <Alert bsStyle="danger">{error}</Alert>
          }
        </form>
      </Panel>
    );
  }
}

