import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { asyncConnect } from 'redux-async-connect';
import { load as loadFamily } from 'redux/modules/family';

const SignedIn = ({ sidebar, dashhead, content }) => (
  <Grid>
    <Row>
      <Col sm={3}>
        {sidebar}
      </Col>
      <Col sm={9}>
        <main role="main">
          {dashhead}
          {content}
        </main>
      </Col>
    </Row>
  </Grid>
);

SignedIn.propTypes = {
  sidebar: React.PropTypes.node.isRequired,
  dashhead: React.PropTypes.node.isRequired,
  content: React.PropTypes.node.isRequired
};

export default asyncConnect([{
  promise: ({ store }) => {
    const promises = [];
    const state = store.getState();
    if (state.family.loaded === false) {
      promises.push(store.dispatch(loadFamily()));
    }
    return Promise.all(promises);
  }
}])(SignedIn);
