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

import DataLoader from '../data/DataLoader';
import Main from '../data/Main';

// const diagnoses = DataLoader.loadDiagnoses();
// console.log(DataLoader.getEvaluator(diagnoses));
console.log('main', Main.runAlgorithms({ '2.065': '2', '1.002': '3' }));

class Scan extends Component {
  state = {
    activeIndex: 0,
    evaluated: []
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
      <div style={{ height: '100%' }}>
        <div style={{ display: 'flex' }}>
          <div className="interview-list">
            <ItemList items={items} activeIndex={this.state.activeIndex} />
          </div>
          <div className="interview-item">
            <ResponseContainer items={items} />
          </div>
          <div className="interview-algorithms">
            <button
              onClick={() =>
                this.setState({
                  evaluated: Main.runAlgorithms(this.props.interview.responses)
                    .evaluated
                })
              }
            >
              Run Algorithms
            </button>
            <div className="list interview-algorithms-evaluator-list">
              {Object.keys(this.state.evaluated).map(key => (
                <div key={key}>
                  <b>{key}</b>
                  <div>{this.state.evaluated[key].toString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => state)(Scan);
