import React from 'react';
import { Row, Col, Tab } from 'react-bootstrap';
import Profile from 'components/settings/Profile';
import Divider from 'theme/components/Divider';
import { asyncConnect } from 'redux-async-connect';
import { connect } from 'react-redux';
import {
  setGroup,
  setTitle
} from 'redux/modules/dashhead';
import {
  setActiveTab
} from 'redux/modules/settings';

const Settings = ({
  settings: { activeTab },
  ...props
}) => (
  <Row>
    <Col xs={12}>
      <Divider
        className="m-y"
        activeKey={activeTab}
        onSelect={props.setActiveTab}
      >
        <Tab eventKey={'profile'} title="Profile">
          <Profile />
        </Tab>
      </Divider>
    </Col>
  </Row>
);

Settings.propTypes = {
  settings: React.PropTypes.object.isRequired,
  setActiveTab: React.PropTypes.func.isRequired
};

export default asyncConnect([{
  promise: ({ store }) => {
    const promises = [];
    promises.push(store.dispatch(setGroup('Other')));
    promises.push(store.dispatch(setTitle('Settings')));
    if (store.getState().settings.activeTab === null) {
      promises.push(store.dispatch(setActiveTab('profile')));
    }
    return Promise.all(promises);
  }
}])(
connect(
  state => (
    {
      settings: state.settings
    }
  ),
  {
    setActiveTab
  }
)(Settings));
