import React from 'react';

export const Switch = ({ checked, onChange, labelOn, labelOff, disabled }) => (
  <label className="scan-switch">
    {labelOff && <span className="scan-switch-label-off">{labelOff}</span>}
    <input
      type="checkbox"
      defaultChecked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <span className="scan-switch-indicator" />
    {labelOn && <span className="scan-switch-label-on">{labelOn}</span>}
  </label>
);
