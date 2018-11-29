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
    matchedPrio1: [],
    matchedPrio2: [],
    matchedPrio3: [],
    notMatchedPrio1: [],
    notMatchedPrio2: [],
    notMatchedPrio3: [],
    algorithmSets: [],
    selectedAlgorithmSet: {},
    showRequirementsList: [],
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

  generateMatchedAlgorithms = (matched, index) => {
    let className, source, tempSource, sourceKeys;
    if (matched === 'matched') {
      tempSource = this.state['matchedPrio' + index];
      sourceKeys = Object.keys(tempSource);
      source = sourceKeys.map(key => {
        const diagnosis = Object.assign({}, tempSource[key]);
        this.enhanceDiagnosis(diagnosis);
        return diagnosis;
      });
      className = 'interview-algorithms-evaluator-list-matched-prio' + index.toString();
    }
    else if (matched === 'notMatched') {
      tempSource = this.state['notMatchedPrio' + index];
      sourceKeys = Object.keys(tempSource);
      source = sourceKeys.map(key => {
        const diagnosis = Object.assign({}, tempSource[key]);
        this.enhanceDiagnosis(diagnosis);
        return diagnosis;
      });
      className = 'interview-algorithms-evaluator-list-not-matched-prio' + index.toString();
    }
    this.enhanceDiagnosis(source);
    return (
      Object.keys(source).map(key => {
        return (
          <div
            key={key}
            className={className}
            onClick={this.onClick(source = source, matched = matched, index = index, key = key)}
          >
            <b>{source[key].key}</b>
            <div>{source[key].explanation}</div>
            {source[key].showRequirements &&
              <div>Show Requirements</div>
            }
          </div>
        )
      })
    )
  }

  onClick = (source, matched, index, key) => () => {
    source.showRequirements = true;
  }

  enhanceDiagnoses = (diagnoses) => {

  }

  enhanceDiagnosis = (diagnosis) => {
    diagnosis.showRequirements = false;
    diagnosis.requirements = {};
  }

  addRequirements = (diagnosis, showRequirements) => {
    if (showRequirements) {
      return this.getRequiredDiagnoses(diagnosis);
    }
    else {
      return {};
    }
  }

  getRequiredDiagnoses = (algorithms, id) => {
    return algorithms.algorithms.get(id).algorithm.children;
  }

  render() {
    const invalidResponseItems = this.props.interview.invalidResponseItems;
    const responses = this.props.interview.responses;
    let validResponses = Object.assign({}, responses);
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
      invalidResponsesInResponses.map(key => (
        keys = keys + ' ' + key))
      window.alert('The following items has invalid answers, and will not be included in the diagnoses: ' + keys)
    }
    let algorithms;
    if (this.state.selectedAlgorithmSet.algorithms) {
      algorithms = Algorithms.run(
        validResponses,
        this.state.selectedAlgorithmSet.algorithms
      );
    }

    // if (algorithms) {
    //   console.log('Enhanced algorithms')
    //   let enhancedDiagnosesKeys = Object.keys(algorithms.matchedPrio3)
    //   let enhancedDiagnoses = enhancedDiagnosesKeys.map(key => {
    //     const diagnosis = Object.assign({}, algorithms.matchedPrio3[key]);
    //     this.enhanceDiagnosis(diagnosis);
    //     return diagnosis;
    //   })
    //   console.log(enhancedDiagnoses)

    //   let matchedPrio1, matchedPrio2, matchedPrio3, notMatchedPrio1, notMatchedPrio2, notMatchedPrio3;

    // }


    return (
      <div className="interview-algorithms" >
        <button
          onClick={() => {
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
          {this.generateMatchedAlgorithms('matched', 1)}
          <h4>Matched Algorithms (second priority)</h4>
          {this.generateMatchedAlgorithms('matched', 2)}
          <h4>Matched Algorithms (third priority)</h4>
          {this.generateMatchedAlgorithms('matched', 3)}
          <h4>Not Matched Algorithms (first priority)</h4>
          {this.generateMatchedAlgorithms('notMatched', 1)}
          <h4>Not Matched Algorithms (second priority)</h4>
          {this.generateMatchedAlgorithms('notMatched', 2)}
          <h4>Not Matched Algorithms (third priority)</h4>
          {this.generateMatchedAlgorithms('notMatched', 3)}
        </div>
      </div>
    );
  }
}

export const AnalysisSidebar = connect(state => state)(AnalysisModal);
