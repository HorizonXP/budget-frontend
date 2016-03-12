import React from 'react';
import Helmet from 'react-helmet';
import { Grid, Row, Col } from 'react-bootstrap';
import LoginBox from 'components/login/LoginBox';
import { replace } from 'react-router-redux';
import { connect } from 'react-redux';

const onLogin = (routing, replaceFunc) => () =>
  replaceFunc(routing.locationBeforeTransitions.query.next || '/');

const Login = ({ routing, ...props }) => (
  <Grid fluid>
    <Helmet
      title="Login"
    />
    <Row>
      <Col xs={12} sm={6} smOffset={3} md={4} mdOffset={4} className="m-t-lg">
        <LoginBox onLogin={onLogin(routing, props.replace)} />
      </Col>
    </Row>
  </Grid>
);

Login.propTypes = {
  routing: React.PropTypes.object.isRequired,
  replace: React.PropTypes.func.isRequired
};

export default connect(
  state => (
    {
      routing: state.routing
    }
  ),
  {
    replace
  }
)(Login);
