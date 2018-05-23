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
import Main from '../data/Main';
import icd10 from '../items/3.0/section.2.icd10.en.json';

class Scan extends Component {
  state = {
    activeIndex: 0,
    evaluated: [],
    matched: [],
    notMatched: []
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
              onClick={() => {
                const algorithms = Main.runAlgorithms(
                  this.props.interview.responses,
                  icd10
                );

                this.setState({
                  evaluated: algorithms.evaluated,
                  matched: algorithms.matched,
                  notMatched: algorithms.notMatched
                });
              }}
            >
              Run Algorithms
            </button>
            <div className="list interview-algorithms-evaluator-list">
              <h4 style={{ color: 'green' }}>Matched Algorithms</h4>
              {Object.keys(this.state.matched).map(key => {
                return (
                  <div key={key}>
                    <b>{key}</b>
                    <div>{this.state.matched[key].explanation}</div>
                  </div>
                );
              })}
              <h4 style={{ color: 'red' }}>Not Matched Algorithms</h4>
              {Object.keys(this.state.notMatched).map(key => {
                return (
                  <div key={key}>
                    <b>{key}</b>
                    <div>{this.state.notMatched[key].explanation}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => state)(Scan);
