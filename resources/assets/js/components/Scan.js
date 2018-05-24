import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { scanInfo, scanData } from '../data';
import { ItemList } from './ItemList';
import { ResponseContainer } from './Items';
import { setActiveItem } from '../actions';
import {
  items,
  getItemByKey,
  getNextItemByKey,
  getPreviousItemByKey
} from '../items';
import Main from '../data/Main';
import icd10 from '../items/3.0/section.2.icd10.en.json';
import jsyaml from 'js-yaml';

class Scan extends Component {
  constructor(props) {
    super(props);
    this.getAlgorithmSets();
  }

  state = {
    evaluated: [],
    matched: [],
    notMatched: [],
    algorithmSets: [],
    selectedAlgorithmSet: {}
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  getAlgorithmSets = () => {
    axios
      .get(`/algorithms.json`)
      .then(response => {
        this.setState({
          algorithmSets: response.data
        });
        this.parseAlgorithms(response.data[0].id);
      })
      .catch(error => console.error(error));
  };

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

    this.props.dispatch(setActiveItem(nextItem.key));
  };

  goToPreviousItem = () => {
    const activeKey = this.props.interview.activeKey;
    const previousItem = getPreviousItemByKey(activeKey);

    this.props.dispatch(setActiveItem(previousItem.key));
  };

  handleSelectChange = event => {
    const id = parseInt(event.target.value, 10);
    this.parseAlgorithms(id);
  };

  parseAlgorithms = id => {
    const selectedAlgorithmSet = this.state.algorithmSets.find(
      set => set.id === id
    );
    try {
      const parsed = jsyaml.load(selectedAlgorithmSet.algorithms);
      this.setState({
        selectedAlgorithmSet: {
          title: selectedAlgorithmSet.title,
          algorithms: parsed
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <div style={{ height: '100%' }}>
        <div style={{ display: 'flex', height: '100%' }}>
          <div className="interview-list">
            <ItemList
              items={items}
              activeIndex={items.indexOf(
                getItemByKey(this.props.interview.activeKey)
              )}
            />
          </div>
          <div className="interview-item">
            <ResponseContainer items={items} />
          </div>
          <div className="interview-algorithms">
            <button
              onClick={() => {
                const algorithms = Main.runAlgorithms(
                  this.props.interview.responses,
                  this.state.selectedAlgorithmSet.algorithms
                );

                this.setState({
                  evaluated: algorithms.evaluated,
                  matched: algorithms.matched,
                  notMatched: algorithms.notMatched
                });
              }}
              className="button"
            >
              Run Algorithms
            </button>
            <select
              value={this.state.value}
              onChange={this.handleSelectChange}
              style={{ backgroundColor: 'white' }}
            >
              {this.state.algorithmSets.map(algorithmSet => (
                <option key={algorithmSet.id} value={algorithmSet.id}>
                  {algorithmSet.title}
                </option>
              ))}
            </select>
            <div className="interview-algorithms-evaluator-list">
              {this.state.selectedAlgorithmSet.title}
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
