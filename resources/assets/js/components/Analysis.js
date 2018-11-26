import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ClickOutside } from './ClickOutside';
import Algorithms from '../data/Algorithms';
import icd10 from '../items/3.0/section.2.icd10.en.json';
import jsyaml from 'js-yaml';

class AnalysisModal extends Component {
  constructor(props) {
    super(props);
    this.getAlgorithmSets();
  }

  state = {
    showAnalysis: false,
    evaluated: [],
    matched: [],
    notMatched: [],
    algorithmSets: [],
    selectedAlgorithmSet: {}
  };

  getAlgorithmSets = () => {
    window.axios
    .get('/algorithms.json')
    .then(response => {
      this.setState({
        algorithmSets: response.data
      });
      this.parseAlgorithms(response.data[0].id);
    })
    .catch(error => console.error(error));
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
      <div style={{ marginLeft: 32, cursor: 'default' }}>
      <div onClick={() => this.setState({ showAnalysis: true })}>
      Analysis
      </div>
      <div
      style={{
        display: this.state.showAnalysis ? 'flex' : 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1000,
        justifyContent: 'center'
      }}
      >
      <ClickOutside
      onClickOutside={() => this.setState({ showAnalysis: false })}
      style={{
        marginTop: 100,
        width: 800,
        backgroundColor: '#fff',
        color: '#000',
        height: '50%',
        padding: 32,
        boxShadow: '0 0 44px 0 rgba(0, 0, 0, 0.2)',
        borderRadius: 3,
        position: 'relative'
      }}
      >
      <button
      style={{ position: 'absolute', top: 10, right: 10 }}
      onClick={() => this.setState({ showAnalysis: false })}
      >
      ✕
      </button>
      <div className="interview-algorithms">
      <button
      onClick={() => {
        const invalidResponseItems = this.props.interview.invalidResponseItems;
        const responses = this.props.interview.responses;
        let validResponses = responses;
        let invalidResponsesInResponses = [];
        // Discard the invalid responses
        invalidResponseItems.map(key => {
          if (responses[key]) {
            invalidResponsesInResponses.push(key);
            delete validResponses[key];
          }
        })
        if (invalidResponsesInResponses.length) {
          let keys = '';
          invalidResponsesInResponses.map(key =>(
            keys = keys + ' ' + key))
          window.alert('The following items has invalid answers, and will not be included in the diagnoses: ' + keys)
        }

        const algorithms = Algorithms.run(
          responses,
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
      <h4>Matched Algorithms</h4>
      {Object.keys(this.state.matched).map(key => {
        return (
          <div
          key={key}
          className="interview-algorithms-evaluator-list-matched"
          >
          <b>{key}</b>
          <div>{this.state.matched[key].explanation}</div>
          </div>
          );
      })}
      <h4>Not Matched Algorithms</h4>
      {Object.keys(this.state.notMatched).map(key => {
        return (
          <div
          key={key}
          className="interview-algorithms-evaluator-list-not-matched"
          >
          <b>{key}</b>
          <div>{this.state.notMatched[key].explanation}</div>
          </div>
          );
      })}
      </div>
      </div>
      </ClickOutside>
      </div>
      </div>
      );
  }
}

export const Analysis = connect(state => state)(AnalysisModal);
