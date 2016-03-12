import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

const SignedIn = ({ sidebar, dashhead, content }) => (
  <Grid>
    <Row>
      <Col sm={3}>
        {sidebar}
      </Col>
      <Col sm={9}>
        <main role="main">
          {dashhead}
          <hr className="m-t" />
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

export default SignedIn;
