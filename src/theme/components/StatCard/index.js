import React from 'react';

const StatCard = ({
  align,
  size,
  delta,
  bgColor,
  deltaStatus,
  value,
  description,
  className
}) => {
  let alignCls = 'text-left';
  let sizeCls = 'p-a';
  let deltaIndicator = null;
  let bgCls = '';
  if (align === 'right') {
    alignCls = 'text-right';
  } else if (align === 'center') {
    alignCls = 'text-center';
  }
  if (size === 'sm') {
    sizeCls = 'p-a';
  } else if (size === 'md') {
    sizeCls = 'p-a-md';
  } else if (size === 'lg') {
    sizeCls = 'p-a-lg';
  }
  if (delta && deltaStatus) {
    if (deltaStatus === 'positive') {
      deltaIndicator = <small className="delta-indicator delta-positive">{delta}</small>;
    } else if (deltaStatus === 'negative') {
      deltaIndicator = <small className="delta-indicator delta-negative">{delta}</small>;
    }
  }
  if (bgColor === 'primary') {
    bgCls = ' statcard-primary';
  } else if (bgColor === 'success') {
    bgCls = ' statcard-success';
  } else if (bgColor === 'info') {
    bgCls = ' statcard-info';
  } else if (bgColor === 'danger') {
    bgCls = ' statcard-danger';
  } else if (bgColor === 'warning') {
    bgCls = ' statcard-warning';
  }
  return (
    <div className={`statcard${bgCls} ${alignCls} ${sizeCls} ${className}`}>
      <h3 className="statcard-number">
        {value}
        {deltaIndicator}
      </h3>
      <span className="statcard-desc">{description}</span>
    </div>
  );
};
StatCard.propTypes = {
  align: React.PropTypes.string,
  size: React.PropTypes.string,
  delta: React.PropTypes.string,
  bgColor: React.PropTypes.string,
  deltaStatus: React.PropTypes.string,
  value: React.PropTypes.string,
  description: React.PropTypes.string,
  className: React.PropTypes.string
};

export default StatCard;
