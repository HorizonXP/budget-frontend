/* eslint no-use-before-define: 0 */
import React from 'react';
import { ButtonInput, Button } from 'react-bootstrap';

export default class MyButtonInput extends ButtonInput {
  renderInput() {
    const { children, value, ...other } = this.props;
    const val = children !== undefined || children !== null ? children : value;
    return <Button {...other} componentClass="button" ref="input" key="input">{val}</Button>;
  }
}

