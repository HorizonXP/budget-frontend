import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

export default class SignedIn extends React.Component {
  static propTypes = {
    sidebar: React.PropTypes.node.isRequired,
    dashhead: React.PropTypes.node.isRequired,
    content: React.PropTypes.node.isRequired
  }
  render() {
    return (
      <Grid>
        <Row>
          <Col sm={3}>
            {this.props.sidebar}
          </Col>
          <Col sm={9}>
            <main role="main">
              {this.props.dashhead}
              <hr className="m-t" />
              {this.props.content}
            </main>
          </Col>
        </Row>
      </Grid>
    );
  }
}
