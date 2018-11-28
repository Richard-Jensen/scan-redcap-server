// Modification of files found on https://github.com/JedWatson/react-select, where it also tells how to install the component Select

import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { setActiveItem, setResponse, setNote } from '../actions';
import { items, scales, getItemByKey, getNextItemByKey } from '../items';

class Dropdown extends React.Component {

  constructor(props, context, dispatch) {
    super(props)
    this.state = {
      selectedOption: null,
      options: this.props.options
    }
  }

  handleChange = (selectedOption) => {
    this.setState({
      selectedOption: selectedOption
    });
    this.props.responseContainer.setState({
      currentPos: 0
    })
    this.props.dispatch(setResponse({
      key: this.props.activeKey,
      value: selectedOption.value
    }));
    this.props.inputBox.current.focus()
  }

  render() {
    return (
      <Select
      value={this.state.selectedOption}
      onChange={this.handleChange}
      options={this.state.options}
      />
      );
  }
}

export default connect()(Dropdown);
