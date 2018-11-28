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
    matchedPrio1: [],
    matchedPrio2: [],
    matchedPrio3: [],
    notMatchedPrio1: [],
    notMatchedPrio2: [],
    notMatchedPrio3: [],
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

  getRequiredDiagnoses = (id) => {

  }

  render() {
    const invalidResponseItems = this.props.interview.invalidResponseItems;
    const responses = this.props.interview.responses;
    let validResponses = Object.assign({}, responses);
    let invalidResponsesInResponses = [];
    return (
      <div className="interview-algorithms">
        <button
          onClick={() => {

            // Discard the invalid responses
            invalidResponseItems.map(key => {
              if (responses[key]) {
                invalidResponsesInResponses.push(key);
                delete validResponses[key];
              }
            })
            if (invalidResponsesInResponses.length) {
              let keys = '';
              invalidResponsesInResponses.map(key => (
                keys = keys + ' ' + key))
              window.alert('The following items has invalid answers, and will not be included in the diagnoses: ' + keys)
            }

            const algorithms = Algorithms.run(
              validResponses,
              this.state.selectedAlgorithmSet.algorithms
            );
            console.log('Checking data from algorithms:');
            console.log(algorithms.algorithms.get('F44').algorithm.children);
            this.setState({
              evaluated: algorithms.evaluated,
              matchedPrio1: algorithms.matchedPrio1,
              matchedPrio2: algorithms.matchedPrio2,
              matchedPrio3: algorithms.matchedPrio3,
              notMatchedPrio1: algorithms.notMatchedPrio1,
              notMatchedPrio2: algorithms.notMatchedPrio2,
              notMatchedPrio3: algorithms.notMatchedPrio3,
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
          <h4>Matched Algorithms (first priority)</h4>
          {Object.keys(this.state.matchedPrio1).map(key => {
            return (
              <div
                onClick={() => {
                  algorithms.algorithms.get('F44').algorithm.children.map(expression => (
                    <div>
                      {expression}
                    </div>
                  ))
                }}
                key={key}
                className="interview-algorithms-evaluator-list-matched-prio1"
              >
                <b>{key}</b>
                <div>{this.state.matchedPrio1[key].explanation}</div>
              </div>
            );
          })}
          <h4>Matched Algorithms (second priority)</h4>
          {Object.keys(this.state.matchedPrio2).map(key => {
            return (
              <div
                onClick={() => { }}
                key={key}
                className="interview-algorithms-evaluator-list-matched-prio2"
              >
                <b>{key}</b>
                <div>{this.state.matchedPrio2[key].explanation}</div>
              </div>
            );
          })}
          <h4>Matched Algorithms (third priority)</h4>
          {Object.keys(this.state.matchedPrio3).map(key => {
            return (
              <div
                onClick={() => { }}
                key={key}
                className="interview-algorithms-evaluator-list-matched-prio3"
              >
                <b>{key}</b>
                <div>{this.state.matchedPrio3[key].explanation}</div>
              </div>
            );
          })}
          <h4>Not Matched Algorithms (first priority)</h4>
          {Object.keys(this.state.notMatchedPrio1).map(key => {
            return (
              <div
                onClick={() => { }}
                key={key}
                className="interview-algorithms-evaluator-list-not-matched-prio1"
              >
                <b>{key}</b>
                <div>{this.state.notMatchedPrio1[key].explanation}</div>
              </div>
            );
          })}
          <h4>Not Matched Algorithms (second priority)</h4>
          {Object.keys(this.state.notMatchedPrio2).map(key => {
            return (
              <div
                onClick={() => { }}
                key={key}
                className="interview-algorithms-evaluator-list-not-matched-prio2"
              >
                <b>{key}</b>
                <div>{this.state.notMatchedPrio2[key].explanation}</div>
              </div>
            );
          })}
          <h4>Not Matched Algorithms (third priority)</h4>
          {Object.keys(this.state.notMatchedPrio3).map(key => {
            return (
              <div
                onClick={() => { }}
                key={key}
                className="interview-algorithms-evaluator-list-not-matched-prio3"
              >
                <b>{key}</b>
                <div>{this.state.notMatchedPrio3[key].explanation}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export const AnalysisSidebar = connect(state => state)(AnalysisModal);
