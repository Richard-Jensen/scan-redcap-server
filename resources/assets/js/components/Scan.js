import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { scanInfo, scanData } from '../data';
import { isTextareaInFocus } from '../lib/helpers';
import { ItemList } from './ItemList';
import { Settings } from './Settings';
import { Analysis } from './Analysis';
import { SearchItems } from './SearchItems';
import Response, {update} from './Response';
import { getNextValidKey, getPreviousValidKey } from '../reducers/interview';
import { setActiveItem } from '../actions';
import {
  items,
  scales,
  getItemByKey,
  getNextItemByKey,
  getPreviousItemByKey
} from '../items';

class Scan extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = event => {
     console.log('child');
    console.log(this.child);
    console.log('/child');
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
    const nextValidKey = getNextValidKey(this.props.interview, activeKey);

    this.props.dispatch(setActiveItem({ key: nextValidKey}));
    console.log('child');
    console.log(this.child);
    console.log('/child');
    this.child.current.update();

  };

  goToPreviousItem = () => {
    const activeKey = this.props.interview.activeKey;
    const previousValidKey = getPreviousValidKey(this.props.interview, activeKey);

    this.props.dispatch(setActiveItem({ key: previousValidKey}));
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
      ref={this.child}
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
