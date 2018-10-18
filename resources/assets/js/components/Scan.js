import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { scanInfo, scanData } from '../data';
import { isTextareaInFocus } from '../lib/helpers';
import { ItemList } from './ItemList';
import { Settings } from './Settings';
import { Analysis } from './Analysis';
import { SearchItems } from './SearchItems';
import Response from './Response';
import { setActiveItem } from '../actions';
import {
  items,
  scales,
  getItemByKey,
  getNextItemByKey,
  getPreviousItemByKey
} from '../items';

class Scan extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = event => {
    if (!isTextareaInFocus()) {
      if (event.key === 'Enter' && !event.shiftKey) {
        this.goToNextItem();
      } else if (event.key === 'Enter' && event.shiftKey) {
        this.goToPreviousItem();
      }
    }
  };

  goToNextItem = () => {
    const activeKey = this.props.interview.activeKey;
    const nextItem = getNextItemByKey(activeKey);

    this.props.dispatch(setActiveItem({ key: nextItem.key }));
  };

  goToPreviousItem = () => {
    const activeKey = this.props.interview.activeKey;
    const previousItem = getPreviousItemByKey(activeKey);

    this.props.dispatch(setActiveItem({ key: previousItem.key }));
  };

  render() {
    return (
      <Fragment>
        <div className="scan-app-top-bar">
          <SearchItems />
          <Settings />
          <Analysis />
        </div>
        <div className="scan-app-main">
          <div className="interview-list">
            <ItemList
              items={items}
              activeIndex={items.indexOf(
                getItemByKey(this.props.interview.activeKey)
              )}
            />
          </div>
          <div className="interview-item">
            <Response
            dispatch={this.props.dispatch}
            interview={this.props.interview}
            settings={this.props.settings}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(state => state)(Scan);
