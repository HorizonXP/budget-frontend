/* eslint react/prop-types: [2, { ignore: ["store"] }] */
import React from 'react';
import { asyncConnect } from 'redux-async-connect';
import { connect } from 'react-redux';
import { Row, Col, Tab, Panel, Input } from 'react-bootstrap';
import StatCard from 'theme/components/StatCard';
import Divider from 'theme/components/Divider';
import {
  setGroup,
  setTitle
} from 'redux/modules/dashhead';
import {
  setActiveTab
} from 'redux/modules/taxes';

const TaxesDashboard = ({
  taxes: { activeTab },
  family: { members },
  ...props
}) => (
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
        activeKey={activeTab}
        onSelect={props.setActiveTab}
        className="m-b"
      >
        { members.map(member => (
            <Tab eventKey={member.username} title={member.first_name}>
              <Row>
                <Col xs={12} md={6}>
                  <Panel header="Income">
                    <Input
                      type="text"
                      placeholder="Employment Income"
                      label="Employment Income"
                      labelClassName="sr-only"
                      required
                      autofocus
                    />
                    <Input
                      type="text"
                      placeholder="Eligible Dividends"
                      label="Eligible Dividends"
                      labelClassName="sr-only"
                      required
                      autofocus
                    />
                    <Input
                      type="text"
                      placeholder="Ineligible Dividends"
                      label="Ineligible Dividends"
                      labelClassName="sr-only"
                      required
                      autofocus
                    />
                    <Input
                      type="text"
                      placeholder="Capital Gains"
                      label="Capital Gains"
                      labelClassName="sr-only"
                      required
                      autofocus
                    />
                  </Panel>
                </Col>
                <Col xs={12} md={6}>
                  <Panel header="Deductions">
                    <Input
                      type="text"
                      placeholder="RRSP Contributions"
                      label="RRSP Contributions"
                      labelClassName="sr-only"
                      required
                      autofocus
                    />
                    <Input
                      type="text"
                      placeholder="Interest Expense"
                      label="Interest Expense"
                      labelClassName="sr-only"
                      required
                      autofocus
                    />
                    <Input
                      type="text"
                      placeholder="RPP Contributions"
                      label="RPP Contributions"
                      labelClassName="sr-only"
                      required
                      autofocus
                    />
                    <Input
                      type="text"
                      placeholder="Prior Capital Losses"
                      label="Prior Capital Losses"
                      labelClassName="sr-only"
                      required
                      autofocus
                    />
                  </Panel>
                </Col>
              </Row>
            </Tab>
          )).toJS() }
      </Divider>
    </Col>
  </Row>
);

TaxesDashboard.propTypes = {
  taxes: React.PropTypes.object.isRequired,
  family: React.PropTypes.object.isRequired,
  setActiveTab: React.PropTypes.func.isRequired
};

export default asyncConnect([{
  promise: ({ store }) => {
    const promises = [];
    promises.push(store.dispatch(setGroup('Other')));
    promises.push(store.dispatch(setTitle('Taxes')));
    if (store.getState().taxes.activeTab === null) {
      const username = store.getState().user.username;
      promises.push(store.dispatch(setActiveTab(username)));
    }
    return Promise.all(promises);
  }
}])(
connect(
  state => (
    {
      taxes: state.taxes,
      family: state.family
    }
  ),
  {
    setActiveTab
  }
)(TaxesDashboard));
