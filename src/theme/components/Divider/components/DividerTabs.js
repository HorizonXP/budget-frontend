import React from 'react';
import ReactDOM from 'react-dom';
import { Nav, NavItem } from 'react-bootstrap';
import ValidComponentChildren from 'theme/components/utils/ValidComponentChildren.js';
import createChainedFunction from 'theme/components/utils/createChainedFunction';
import keycode from 'keycode';

const paneId = (props, child) =>
  child.props.id
    ? child.props.id
    : props.id && `${props.id}___pane___${child.props.eventKey}`;
const tabId = (props, child) =>
  child.props.id
    ? `${child.props.id}___tab`
    : props.id && `${props.id}___tab___${child.props.eventKey}`;

const findChild = ValidComponentChildren.find;

function getDefaultActiveKeyFromChildren(children) {
  let defaultActiveKey;

  ValidComponentChildren.forEach(children, child => {
    if (defaultActiveKey === null) {
      defaultActiveKey = child.props.eventKey;
    }
  });

  return defaultActiveKey;
}

function move(children, currentKey, keys, moveNext) {
  const lastIdx = keys.length - 1;
  const stopAt = keys[moveNext ? Math.max(lastIdx, 0) : 0];
  let nextKey = currentKey;

  function getNext() {
    const idx = keys.indexOf(nextKey);
    nextKey = moveNext
      ? keys[Math.min(lastIdx, idx + 1)]
      : keys[Math.max(0, idx - 1)];

    return findChild(children,
      _child => _child.props.eventKey === nextKey);
  }

  let next = getNext();

  while (next.props.eventKey !== stopAt && next.props.disabled) {
    next = getNext();
  }

  return next.props.disabled ? currentKey : next.props.eventKey;
}

export default class DividerTabs extends React.Component {
  static propTypes = {
    activeKey: React.PropTypes.any,
    children: React.PropTypes.node.isRequired,
    defaultActiveKey: React.PropTypes.any,
    animation: React.PropTypes.bool,
    id: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    onSelect: React.PropTypes.func,
  }

  static defaultProps = {
    animation: true
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: props.defaultActiveKey !== null
        ? props.defaultActiveKey
        : getDefaultActiveKeyFromChildren(props.children),
      previousActiveKey: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeKey !== null && nextProps.activeKey !== this.props.activeKey) {
      // check if the 'previousActiveKey' child still exists
      const previousActiveKey = this.props.activeKey;
      React.Children.forEach(nextProps.children, (child) => {
        if (React.isValidElement(child)) {
          if (child.props.eventKey === previousActiveKey) {
            this.setState({
              previousActiveKey
            });
            return;
          }
        }
      });
    }
  }

  shouldComponentUpdate() {
    // Defer any updates to this component during the `onSelect` handler.
    return !this._isChanging;
  }

  componentDidUpdate() {
    const tabs = this._tabs;
    const tabIdx = this._eventKeys().indexOf(this.getActiveKey());

    if (this._needsRefocus) {
      this._needsRefocus = false;
      if (tabs && tabIdx !== -1) {
        const tabNode = ReactDOM.findDOMNode(tabs[tabIdx]);

        if (tabNode) {
          tabNode.firstChild.focus();
        }
      }
    }
  }

  getActiveKey = () => this.props.activeKey !== undefined
    ? this.props.activeKey
    : this.state.activeKey

  handlePaneAnimateOutEnd = () => {
    this.setState({
      previousActiveKey: null
    });
  }

  handleSelect = selectedKey => {
    if (this.props.onSelect) {
      this._isChanging = true;
      this.props.onSelect(selectedKey);
      this._isChanging = false;
      return;
    }

    // if there is no external handler, then use embedded one
    const previousActiveKey = this.getActiveKey();
    if (selectedKey !== previousActiveKey) {
      this.setState({
        activeKey: selectedKey,
        previousActiveKey
      });
    }
  }

  handleKeyDown = event => {
    const keys = this._eventKeys();
    const currentKey = this.getActiveKey() || keys[0];
    let next;

    switch (event.keyCode) {
      case keycode.codes.left:
      case keycode.codes.up:
        next = move(this.props.children, currentKey, keys, false);

        if (next && next !== currentKey) {
          event.preventDefault();
          this.handleSelect(next);
          this._needsRefocus = true;
        }
        break;
      case keycode.codes.right:
      case keycode.codes.down:
        next = move(this.props.children, currentKey, keys, true);

        if (next && next !== currentKey) {
          event.preventDefault();
          this.handleSelect(next);
          this._needsRefocus = true;
        }
        break;
      default:
        break;
    }
  }

  _eventKeys() {
    const keys = [];

    ValidComponentChildren.forEach(this.props.children,
      ({ props: { eventKey } }) => keys.push(eventKey));

    return keys;
  }

  renderPane = (child, index) => {
    const previousActiveKey = this.state.previousActiveKey;

    const shouldPaneBeSetActive = child.props.eventKey === this.getActiveKey();
    const thereIsNoActivePane = previousActiveKey === null;

    const paneIsAlreadyActive = previousActiveKey !== null
      && child.props.eventKey === previousActiveKey;

    return React.cloneElement(
      child,
      {
        active: shouldPaneBeSetActive && (thereIsNoActivePane || !this.props.animation),
        id: paneId(this.props, child),
        'aria-labelledby': tabId(this.props, child),
        key: child.key ? child.key : index,
        animation: this.props.animation,
        onAnimateOutEnd: paneIsAlreadyActive ? this.handlePaneAnimateOutEnd : null
      }
    );
  }

  renderTab = (child, index) => {
    if (child.props.title === null) {
      return null;
    }

    const { eventKey, title, disabled, onKeyDown, tabClassName, tabIndex = 0 } = child.props;
    const isActive = this.getActiveKey() === eventKey;
    const refFunc = ref => {
      (this._tabs || (this._tabs = []))[index] = ref;
    };

    return (
      <NavItem
        linkId={tabId(this.props, child)}
        ref={refFunc}
        aria-controls={paneId(this.props, child)}
        onKeyDown={createChainedFunction(this.handleKeyDown, onKeyDown)}
        eventKey={eventKey}
        tabIndex={isActive ? tabIndex : -1}
        disabled={disabled}
        className={tabClassName}
      >
        {title}
      </NavItem>
    );
  }

  render() {
    const { children, ...props } = this.props;
    const tabsProps = {
      ...props,
      bsStyle: 'pills',
      className: 'hr-divider-content hr-divider-nav',
      activeKey: this.getActiveKey(),
      onSelect: this.handleSelect,
      ref: 'tabs',
      role: 'tablist'
    };
    const panesProps = {
      className: 'tab-content',
      ref: 'panes'
    };
    const childTabs = ValidComponentChildren.map(children, this.renderTab);
    const childPanes = ValidComponentChildren.map(children, this.renderPane);
    return (
      <div>
        <div className={`${props.className} hr-divider`}>
          <Nav {...tabsProps}>
            {childTabs}
          </Nav>
        </div>
        <div {...panesProps}>
          {childPanes}
        </div>
      </div>
    );
  }
}

