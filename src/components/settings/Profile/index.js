import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Editor from './components/Editor';

const Profile = () => (
  <Row>
    <Col xs={12}>
      <Editor />
    </Col>
  </Row>
);

export default Profile;
