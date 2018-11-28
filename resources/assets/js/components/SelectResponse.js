// Modification of files found on https://github.com/JedWatson/react-select, where it also tells how to install the component Select

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setActiveItem, setResponse, setNote } from '../actions';
import { items, scales, getItemByKey, getNextItemByKey } from '../items';

class SelectResponse extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      value: '',
      options: this.props.options,
    }
  }

  handleChange = (event) => {
    this.setState({
      value: event.target.value
    });
    this.props.responseContainer.setState({
      currentPos: 0,
      dropdownValue: event.target.value,
    })
    this.props.dispatch(setResponse({
      key: this.props.activeKey,
      value: event.target.value,
      dropdownValue: event.target.value,
    }));
    this.props.inputBox.current.focus()
  }


  render() {
    return (
      <form>
      <label>
      <select value={this.props.responseContainer.state.dropdownValue} onChange={this.handleChange}>
      {this.state.options.map(option => {
        return (
          <option key={option.key} value={option.value}>{option.label}</option>
          )
      })}
      </select>
      </label>
      </form>
      );
  }
}

export default connect()(SelectResponse);
