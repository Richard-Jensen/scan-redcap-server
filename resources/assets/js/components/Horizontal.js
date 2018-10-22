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
      value: value.toString()
    }))
  };
  let handleChangeStart = function() {
    console.log('Change event started')
  };
  let handleChangeComplete = function() {
    console.log('Change event completed')
  }
  return {
    handleChangeStart,
    handleChange,
    handleChangeComplete
  }
}

class Horizontal extends Component {
  constructor (props, context, dispatch) {
    super(props, context);
    this.state = {
      value: 0,
    };
    this.handlers = createHandlers(this.props.dispatch, this.props.interview);
  }

  getValue() {
    return this.state.value
  }

  handleChange = value => {
    this.setState({
      value: value
    })
    this.handlers.handleChange(value)
    this.props.response.setState({
      value: value
    })
  }

  handleComplete = () => {
    console.log('Change event completed')
    this.props.inputBox.current.focus()
  }

  render () {
    const { value } = this.props.responseValue
    return (
      <div className='slider'>
      <Slider
      min={this.props.min}
      max={this.props.max}
      value={parseInt(this.props.responseValue)}
      onChangeStart={console.log('Change event started')}
      onChange={this.handleChange}
      onChangeComplete={this.handleComplete}
      />
      <div className='value'>{value}</div>
      </div>
      )
  }
}

export default connect()(Horizontal);

