import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { scanInfo, scanData } from '../data';
import { ItemList, ResponseContainer } from './Items';
import { setActiveItem } from '../actions';
import {
  items,
  getItemByKey,
  getNextItemByKey,
  getPreviousItemByKey
} from '../items';

class Scan extends Component {
  state = {
    activeIndex: 0
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      this.goToNextItem();
    } else if (event.key === 'Enter' && event.shiftKey) {
      this.goToPreviousItem();
    }
  };

  goToNextItem = () => {
    const activeKey = this.props.interview.activeKey;
    const nextItem = getNextItemByKey(activeKey);
    this.setActiveIndex();
    this.props.dispatch(setActiveItem(nextItem.key));
  };

  goToPreviousItem = () => {
    const activeKey = this.props.interview.activeKey;
    const previousItem = getPreviousItemByKey(activeKey);
    this.setActiveIndex();
    this.props.dispatch(setActiveItem(previousItem.key));
  };

  setActiveIndex = () => {
    const activeKey = this.props.interview.activeKey;
    const activeIndex = items.indexOf(getItemByKey(activeKey));
    this.setState({
      activeIndex
    });
  };

  render() {
    return (
      <div>
        <div style={{ display: 'flex' }}>
          <ItemList items={items} activeIndex={this.state.activeIndex} />
          <ResponseContainer items={items} />
        </div>
        <textarea
          placeholder="Save some JSON"
          defaultValue={JSON.stringify(scanData.data)}
        />
      </div>
    );
  }
}

export default connect(state => state)(Scan);
