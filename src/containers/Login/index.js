import React from 'react';
import Helmet from 'react-helmet';
import { Grid } from 'react-bootstrap';

export default class Login extends React.Component {
  render() {
    return (
      <Grid fluid>
        <Helmet
          title="Login"
        />
        <h1>Login</h1>
      </Grid>
    );
  }
}
