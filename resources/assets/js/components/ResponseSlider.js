import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { setActiveItem, setResponse, setNote } from '../actions';
import { ItemCard } from './ItemCard';
import { validateNumeric, isValueWithinWholeRangeOfRules } from '../lib/helpers';
import { Markdown } from './Markdown';
import { items, scales, getItemByKey } from '../items';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

let createHandlers = function(dispatch, interview) {
  let handleChange = function(value) {
    dispatch(setResponse({
      key: interview.activeKey,
      value: value.toString(),
      sliderValue: value
    }))
  };
  let handleChangeStart = function() {
  };
  let handleChangeComplete = function() {
  }
  return {
    handleChangeStart,
    handleChange,
    handleChangeComplete
  }
}

class ResponseSlider extends Component {
  constructor (props, context, dispatch) {
    super(props, context);
    this.state = {
      value: 0,
    };
    this.handlers = createHandlers(this.props.dispatch, this.props.interview);
  }

  handleChangeStart = () => {
  }

  handleChange = value => {
    this.setState({
      value: value
    })
    this.handlers.handleChange(value)
    this.props.response.setState({
      sliderValue: value,
      currentPos: this.props.response.getIndexByKey(value.toString(), this.props.array)
    })

  }

  handleComplete = () => {
    this.props.inputBox.current.focus()
  }

  render () {
    const { value } = this.props.value
    return (
      <div className='responseSlider'>
      <Slider
      min={this.props.min}
      max={this.props.max}
      value={this.props.value}
      onChangeStart={this.handleChangeStart}
      onChange={this.handleChange}
      onChangeComplete={this.handleComplete}
      />
      <div className='value'>{value}</div>
      </div>
      )
  }
}

export default connect()(ResponseSlider);

