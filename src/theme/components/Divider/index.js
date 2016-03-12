import React from 'react';
import DividerTabs from './components/DividerTabs';

const Divider = ({ heading, children, ...props }) => {
  let content = '';
  if (heading) {
    const headerProps = props;
    headerProps.className += ' hr-divider';
    content = (
      <div {...headerProps}>
        <h3 className="hr-divider-content hr-divider-heading">
          {heading}
        </h3>
      </div>
    );
  } else if (children) {
    content = (
      <DividerTabs {...props}>
        {children}
      </DividerTabs>
    );
  } else {
    content = (
      <hr {...props} />
    );
  }
  return content;
};

Divider.propTypes = {
  children: React.PropTypes.node,
  heading: React.PropTypes.string
};

export default Divider;
