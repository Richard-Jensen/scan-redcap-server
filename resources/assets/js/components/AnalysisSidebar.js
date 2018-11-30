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

  // Old method for generating algorithms
  // generateMatchedAlgorithms = (matched, index) => {
  //   let className, source, tempSource, sourceKeys;
  //   if (matched === 'matched') {
  //     tempSource = this.state['matchedPrio' + index];
  //     sourceKeys = Object.keys(tempSource);
  //     source = sourceKeys.map(key => {
  //       const diagnosis = Object.assign({}, tempSource[key]);
  //       this.enhanceDiagnosis(diagnosis);
  //       return diagnosis;
  //     });
  //     className = 'interview-algorithms-evaluator-list-matched-prio' + index.toString();
  //   }
  //   else if (matched === 'notMatched') {
  //     tempSource = this.state['notMatchedPrio' + index];
  //     sourceKeys = Object.keys(tempSource);
  //     source = sourceKeys.map(key => {
  //       const diagnosis = Object.assign({}, tempSource[key]);
  //       this.enhanceDiagnosis(diagnosis);
  //       return diagnosis;
  //     });
  //     className = 'interview-algorithms-evaluator-list-not-matched-prio' + index.toString();
  //   }
  //   this.enhanceDiagnosis(source);
  //   return (
  //     Object.keys(source).map(key => {
  //       return (
  //         <div
  //           key={key}
  //           className={className}
  //           onClick={this.onClick(source = source, matched = matched, index = index, key = key)}
  //         >
  //           <b>{source[key].key}</b>
  //           <div>{source[key].explanation}</div>
  //           {source[key].showRequirements &&
  //             <div>Show Requirements</div>
  //           }
  //         </div>
  //       )
  //     })
  //   )
  // }

  generateEnhancedDiagnoses = (diagnoses) => {
    const diagnosesClone = Object.keys(diagnoses).map(key => {
      const diagnosisClone = Object.assign({}, diagnoses[key]);
      this.enhanceDiagnosis(diagnosisClone);
      return diagnosisClone;
    });
    this.enhanceDiagnosis(diagnosesClone)
    return diagnosesClone;
  }

  showMatchedDiagnoses = (diagnoses, matched, index) => {
    let className;
    if (matched === 'matched') {
      className = 'interview-algorithms-evaluator-list-matched-prio' + index.toString();
    }
    else {
      className = 'interview-algorithms-evaluator-list-not-matched-prio' + index.toString();
    }
    return (
      Object.keys(diagnoses).map(key => {
        return (
          <div
            key={key}
            className={className}
            onClick={this.onClick(matched = matched, index = index, key = key)}
          >
            <b>{diagnoses[key].key}</b>
            <div>{diagnoses[key].explanation}</div>
            {diagnoses[key].showRequirements &&
              <div>
                {
                  diagnoses[key].requirements.map(req => {
                    console.log(diagnoses[key].algorithm.operator)
                    return (
                      <div key={req.id} className='interview-algorithms-subcriterion'>{req.expression}</div>
                    )
                  })
                }
              </div>
            }
          </div>
        )
      })
    )
  }

  onClick = (matched, index, key) => () => {
    let newState = this.state[matched + 'Prio' + index];
    newState[key].showRequirements = !newState[key].showRequirements;
    this.setState({
      [this.state[matched + 'Prio' + index]]: newState,
    })
  }

  enhanceDiagnosis = (diagnosis) => {
    diagnosis.showRequirements = false;
    diagnosis.requirements = diagnosis.algorithm ? this.getRequiredDiagnoses(diagnosis) : {};
  }
  
  getRequiredDiagnoses = (diagnosis) => {
    return diagnosis.algorithm.children;
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
              matchedPrio1: this.generateEnhancedDiagnoses(algorithms.matchedPrio1),
              matchedPrio2: this.generateEnhancedDiagnoses(algorithms.matchedPrio2),
              matchedPrio3: this.generateEnhancedDiagnoses(algorithms.matchedPrio3),
              notMatchedPrio1: this.generateEnhancedDiagnoses(algorithms.notMatchedPrio1),
              notMatchedPrio2: this.generateEnhancedDiagnoses(algorithms.notMatchedPrio1),
              notMatchedPrio3: this.generateEnhancedDiagnoses(algorithms.notMatchedPrio1),
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
        {algorithms &&
          <div className="interview-algorithms-evaluator-list">
            <h4>Matched Algorithms (first priority)</h4>
            {this.showMatchedDiagnoses(this.state.matchedPrio1, 'matched', 1)}
            <h4>Matched Algorithms (second priority)</h4>
            {this.showMatchedDiagnoses(this.state.matchedPrio2, 'matched', 2)}
            <h4>Matched Algorithms (third priority)</h4>
            {this.showMatchedDiagnoses(this.state.matchedPrio3, 'matched', 3)}
            <h4>Not Matched Algorithms (first priority)</h4>
            {this.showMatchedDiagnoses(this.state.notMatchedPrio1, 'notMatched', 1)}
            <h4>Not Matched Algorithms (second priority)</h4>
            {this.showMatchedDiagnoses(this.state.notMatchedPrio2, 'notMatched', 2)}
            <h4>Not Matched Algorithms (third priority)</h4>
            {this.showMatchedDiagnoses(this.state.notMatchedPrio3, 'notMatched', 3)}
          </div>
        }
      </div>
    );
  }
}

export const AnalysisSidebar = connect(state => state)(AnalysisModal);
