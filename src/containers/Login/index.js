import React from 'react';
import Helmet from 'react-helmet';
import { Grid, Row, Col } from 'react-bootstrap';
import LoginBox from 'components/login/LoginBox';
import { replace } from 'react-router-redux';
import { connect } from 'react-redux';

@connect(
  state => (
    {
      routing: state.routing
    }
  ),
  {
    replace
  }
)
export default class Login extends React.Component {
  static propTypes = {
    routing: React.PropTypes.object.isRequired,
    replace: React.PropTypes.func.isRequired
  }

  onLogin = () => {
    const { routing: { locationBeforeTransitions } } = this.props;
    const next = (locationBeforeTransitions.query.next) || '/';
    this.props.replace(next);
  }

  render() {
    return (
      <Grid fluid>
        <Helmet
          title="Login"
        />
        <Row>
          <Col xs={12} sm={6} smOffset={3} md={4} mdOffset={4} className="m-t-lg">
            <LoginBox onLogin={this.onLogin} />
          </Col>
        </Row>
      </Grid>
    );
  }
}
