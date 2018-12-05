import React, { Component } from 'react';
import { connect } from 'react-redux';
import Algorithms from '../data/Algorithms';
import jsyaml from 'js-yaml';

class AnalysisModal extends Component {
  constructor(props) {
    super(props);
    this.getDiagnosisSets();
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
    diagnosisSets: [],
    selectedDiagnosisSet: {},
    showRequirementsList: [],
  };

  getDiagnosisSets = () => {
    window.axios
      .get('/algorithms.json')
      .then(response => {
        this.setState({
          diagnosisSets: response.data
        });
        this.parseDiagnoses(response.data[0].id);
      })
      .catch(error => console.error(error));
  };

  handleSelectChange = event => {
    const id = parseInt(event.target.value, 10);
    this.parseDiagnoses(id);
  };

  parseDiagnoses = id => {
    const selectedDiagnosisSet = this.state.diagnosisSets.find(
      set => set.id === id
    );
    try {
      const parsed = jsyaml.load(selectedDiagnosisSet.algorithms);
      this.setState({
        selectedDiagnosisSet: {
          title: selectedDiagnosisSet.title,
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
  //     className = 'interview-diagnoses-evaluator-list-matched-prio' + index.toString();
  //   }
  //   else if (matched === 'notMatched') {
  //     tempSource = this.state['notMatchedPrio' + index];
  //     sourceKeys = Object.keys(tempSource);
  //     source = sourceKeys.map(key => {
  //       const diagnosis = Object.assign({}, tempSource[key]);
  //       this.enhanceDiagnosis(diagnosis);
  //       return diagnosis;
  //     });
  //     className = 'interview-diagnoses-evaluator-list-not-matched-prio' + index.toString();
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
      className = 'interview-diagnoses-evaluator-list-matched-prio' + index.toString();
    }
    else {
      className = 'interview-diagnoses-evaluator-list-not-matched-prio' + index.toString();
    }
    return (
      Object.keys(diagnoses).map(key => {
        return (
          <div key={key}>
            <div
              key={key}
              className={className}
              onClick={this.onClick(matched = matched, index = index, key = key)}
            >
              <b>{diagnoses[key].key}</b>
              <div>{diagnoses[key].explanation}</div>
            </div>
            {diagnoses[key].showRequirements &&
              this.showSubDiagnoses(diagnoses[key])
            }
          </div>
        )
      })
    )
  }

  showSubDiagnoses = (diagnosis) => {
    if (diagnosis.showRequirements) {
      if (diagnosis.requirements) {
        console.log(diagnosis)
        return (
          <div key={diagnosis.id}>
            <div>{diagnosis.algorithm.operator}</div>
            <div className='interview-diagnoses-subdiagnoses'>
              {diagnosis.requirements.map(req => {
                return this.showSubDiagnoses(req, req.showRequirements);
              })}
            </div>
          </div>
        )
      }
      else {
        diagnosis.requirements = this.getRequiredDiagnoses(diagnosis);
        return this.showSubDiagnoses(diagnosis, diagnosis.showRequirements)
      }
    }
    else {
      if (diagnosis.children) {
        return (
          <div>
            <div>{diagnosis.operator}</div>
            <div className='interview-diagnoses-subdiagnoses'>
              {diagnosis.children.map(child => {
                return this.showSubDiagnoses(child, child.showRequirements);
              })}
            </div>
          </div>
        )
      }
      else if (diagnosis.expression) {
        let expression = diagnosis.expression;
        while (expression.charAt(0) === '$' || expression.charAt(0) === '@') {
          expression = expression.substr(1);
        }
        return (
          <div key={diagnosis.expression} className='interview-diagnoses-expression'>
            {expression}
          </div>
        )
      }
      else {
        return (
          <div key={diagnosis.operator} className='interview-diagnoses-operator'>
            {diagnosis.operator}
          </div>
        )
      }
    }
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
    diagnosis.requirements = false;
  }

  getRequiredDiagnoses = (diagnosis) => {
    if (diagnosis.algorithm) {
      let children = diagnosis.algorithm.children;
      this.generateEnhancedDiagnoses(children);
      return children;
    }
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
    let diagnoses;
    if (this.state.selectedDiagnosisSet.algorithms) {
      diagnoses = Algorithms.run(
        validResponses,
        this.state.selectedDiagnosisSet.algorithms
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
      <div className="interview-diagnoses" >
        <button
          onClick={() => {
            this.setState({
              evaluated: diagnoses.evaluated,
              matchedPrio1: this.generateEnhancedDiagnoses(diagnoses.matchedPrio1),
              matchedPrio2: this.generateEnhancedDiagnoses(diagnoses.matchedPrio2),
              matchedPrio3: this.generateEnhancedDiagnoses(diagnoses.matchedPrio3),
              notMatchedPrio1: this.generateEnhancedDiagnoses(diagnoses.notMatchedPrio1),
              notMatchedPrio2: this.generateEnhancedDiagnoses(diagnoses.notMatchedPrio1),
              notMatchedPrio3: this.generateEnhancedDiagnoses(diagnoses.notMatchedPrio1),
            });
          }}
          className="button"
        >
          Run Diagnosess
      </button>
        <select
          value={this.state.value}
          onChange={this.handleSelectChange}
          style={{ backgroundColor: 'white' }}
        >
          {this.state.diagnosisSets.map(diagnosisSet => (
            <option key={diagnosisSet.id} value={diagnosisSet.id}>
              {diagnosisSet.title}
            </option>
          ))}
        </select>
        {diagnoses &&
          <div className="interview-diagnoses-evaluator-list">
            <h4>Matched Diagnoses (first priority)</h4>
            {this.showMatchedDiagnoses(this.state.matchedPrio1, 'matched', 1)}
            <h4>Matched Diagnoses (second priority)</h4>
            {this.showMatchedDiagnoses(this.state.matchedPrio2, 'matched', 2)}
            <h4>Matched Diagnoses (third priority)</h4>
            {this.showMatchedDiagnoses(this.state.matchedPrio3, 'matched', 3)}
            <h4>Not Matched Diagnoses (first priority)</h4>
            {this.showMatchedDiagnoses(this.state.notMatchedPrio1, 'notMatched', 1)}
            <h4>Not Matched Diagnoses (second priority)</h4>
            {this.showMatchedDiagnoses(this.state.notMatchedPrio2, 'notMatched', 2)}
            <h4>Not Matched Diagnoses (third priority)</h4>
            {this.showMatchedDiagnoses(this.state.notMatchedPrio3, 'notMatched', 3)}
          </div>
        }
      </div>
    );
  }
}

export const AnalysisSidebar = connect(state => state)(AnalysisModal);
