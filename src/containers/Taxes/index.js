/* eslint react/prop-types: [2, { ignore: ["store"] }] */
import React from 'react';
import { asyncConnect } from 'redux-async-connect';
import { connect } from 'react-redux';
import { Row, Col, Tab } from 'react-bootstrap';
import StatCard from 'theme/components/StatCard';
import Divider from 'theme/components/Divider';
import {
  setGroup,
  setTitle
} from 'redux/modules/dashhead';
import {
  setActiveTab,
  getActiveTab
} from 'redux/modules/taxes';

const TaxesDashboard = ({ taxes, ...props }) => (
  <Row>
    <Col xs={12}>
      <Row>
        <Divider heading="Summary" className="m-t m-b-md" />
        <Col xs={12} sm={6} md={4}>
          <StatCard
            value="$12,938"
            description="Taxable Income"
            bgColor="success"
            align="left"
            size="sm"
            className="m-b"
          />
        </Col>
        <Col xs={12} sm={6} md={4}>
          <StatCard
            value="$1,048"
            description="RRSP Deduction"
            bgColor="success"
            align="left"
            size="sm"
            className="m-b"
          />
        </Col>
        <Col xs={12} sm={6} smOffset={3} md={4} mdOffset={0}>
          <StatCard
            value="$848"
            description="Taxes Payable"
            bgColor="success"
            align="left"
            size="sm"
            className="m-b"
          />
        </Col>
      </Row>
      <Divider
        activeKey={getActiveTab(taxes)}
        onSelect={props.setActiveTab}
      >
        <Tab eventKey={'yours'} title="Yours">Your income taxes</Tab>
        <Tab eventKey={'spouse'} title="Spouse">Spouse's income taxes</Tab>
      </Divider>
    </Col>
  </Row>
);

TaxesDashboard.propTypes = {
  taxes: React.PropTypes.object.isRequired,
  setActiveTab: React.PropTypes.func.isRequired
};

export default asyncConnect([{
  promise: ({ store }) => {
    const promises = [];
    promises.push(store.dispatch(setGroup('Other')));
    promises.push(store.dispatch(setTitle('Taxes')));
    return Promise.all(promises);
  }
}])(
connect(
  state => (
    {
      taxes: state.taxes
    }
  ),
  {
    setActiveTab
  }
)(TaxesDashboard));
