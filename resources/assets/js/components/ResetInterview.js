import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { resetInterview } from '../actions';
import { ClickOutside } from './ClickOutside';

class ResetInterview extends React.Component {
  render() {
    return (
      <div style={{ marginLeft: 32, cursor: 'default' }}>
    <div onClick={() => {
      if (window.confirm('Are you sure you wish to reset the interview? All selected options will be lost')) {
        this.props.dispatch(resetInterview())}}}>
    Reset Interview
    </div>
    <div
    style={{
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1000,
      justifyContent: 'center'
    }}
    >

    </div>
    </div>
    )
  }
}

export default connect()(ResetInterview);

