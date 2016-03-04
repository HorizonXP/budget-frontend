import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

export default class SignedIn extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired
  }
  render() {
    const css = require('./SignedIn.scss');
    const cls = 'full-height';
    return (
      <div className={cls}>
        <main role="main" className={`${css.main} ${cls}`}>
          {this.props.children}
        </main>
        <footer className={`${css.footer}`}>
          <Grid fluid>
            <Row>
              <Col xs={6} sm={4} className={`text-left ${css.logo}`} />
              <Col xs={6} sm={4} smOffset={4} className={`text-left ${css.logo}`} />
            </Row>
          </Grid>
        </footer>
      </div>
    );
  }
}
