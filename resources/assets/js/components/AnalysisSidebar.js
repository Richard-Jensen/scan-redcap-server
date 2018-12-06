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
              onClick={this.onClick([{ key: key, type: matched + 'Prio' + index }])}
            >
              <b>{diagnoses[key].key}</b>
              <div>{diagnoses[key].explanation}</div>
            </div>
            {diagnoses[key].showRequirements &&
              this.showSubDiagnoses(diagnoses[key], [{ key: key, type: matched + 'Prio' + index }])
            }
          </div>
        )
      })
    )
  }

  showSubDiagnoses = (diagnosis, path) => {
    if (diagnosis.showRequirements) {
      if (diagnosis.requirements) {
        return (
          <div key={diagnosis.id}>
            <div>{diagnosis.algorithm.operator}</div>
            <div className='interview-diagnoses-subdiagnoses'>
              {diagnosis.requirements.map(req => {
                let index = diagnosis.requirements.indexOf(req)
                let newPath = Object.assign([], path);
                newPath.push({ key: index, type: 'requirements' })
                return this.showSubDiagnoses(req, newPath);
              })}
            </div>
          </div>
        )
      }
      else {
        diagnosis.requirements = this.getRequiredDiagnoses(diagnosis);
        return this.showSubDiagnoses(diagnosis, path)
      }
    }
    else {
      if (diagnosis.children) {
        // Avoiding two children having the same key, for example 'OR'.
        let operatorKey = diagnosis.operator;
        diagnosis.children.map(child => {
          operatorKey = operatorKey + child.id;
        })
        return (
          <div key={operatorKey}>
            <div>{diagnosis.operator}</div>
            <div className='interview-diagnoses-subdiagnoses'>
              {diagnosis.children.map(child => {
                let index = diagnosis.children.indexOf(child);
                let newPath = Object.assign([], path);
                newPath.push({ key: index, type: 'children' });
                return this.showSubDiagnoses(child, newPath);
              })}
            </div>
          </div>
        )
      }
      else if (diagnosis.expression) {
        diagnosis.path = path;
        let expression = diagnosis.expression;
        while (expression.charAt(0) === '$' || expression.charAt(0) === '@' || expression.charAt(0) === '!') {
          expression = expression.substr(1);
        }
        return (
          <div key={diagnosis.expression} className='interview-diagnoses-expression' onClick={this.onClick(path)}>
            {expression}
          </div>
        )
      }
    }
  }

  onClick = (path) => () => {
    let currentDiagnosis = this.state[path[0].type][parseInt(path[0].key, 10)];
    if (path.length > 1) {
      this.showRequirementsFromPath(path, currentDiagnosis.algorithm.children, 1)
    }
    else {
      currentDiagnosis.showRequirements = !currentDiagnosis.showRequirements;
    }
    this.setState({
      [this.state[path[0].type][parseInt(path[0].key, 10)]]: currentDiagnosis,
    })
  }

  showRequirementsFromPath = (path, diagnosis, counter) => {
    if (counter < path.length) {
      diagnosis[path[counter].key].showRequirements = true;
      this.showRequirementsFromPath(path, diagnosis[path[counter].key], counter + 1);
    }
    else {
      diagnosis.showRequirements = !diagnosis.showRequirements;
    }
  }

  // HVORFOR VIRKER DET HER IK?????????????
  // showRequirementsFromPath = (path, diagnosis, counter) => {
  //   if (counter < path.length) {
  //     console.log(counter)
  //     console.log(diagnosis)
  //     console.log(path)
  //     let tempDiagnosis = diagnosis[path[counter].key];
  //     console.log(tempDiagnosis)
  //     this.showRequirementsFromPath(path, tempDiagnosis, counter + 1);
  //   }
  //   else {
  //     diagnosis.showRequirements = !diagnosis.showRequirements;
  //   }
  // }

  enhanceDiagnoses = (diagnoses) => {
    const diagnosesClone = Object.keys(diagnoses).map(key => {
      const diagnosisClone = Object.assign({}, diagnoses[key]);
      this.enhanceDiagnosis(diagnosisClone, key);
      return diagnosisClone;
    });
    return diagnosesClone;
  }

  enhanceDiagnosis = (diagnosis) => {
    diagnosis.showRequirements = false;
    diagnosis.requirements = false;
  }

  getRequiredDiagnoses = (diagnosis) => {
    if (diagnosis.algorithm) {
      let children = diagnosis.algorithm.children;
      this.enhanceDiagnoses(children);
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

    return (
      <div className="interview-diagnoses" >
        <button
          onClick={() => {
            this.setState({
              evaluated: diagnoses.evaluated,
              matchedPrio1: this.enhanceDiagnoses(diagnoses.matchedPrio1),
              matchedPrio2: this.enhanceDiagnoses(diagnoses.matchedPrio2),
              matchedPrio3: this.enhanceDiagnoses(diagnoses.matchedPrio3),
              notMatchedPrio1: this.enhanceDiagnoses(diagnoses.notMatchedPrio1),
              notMatchedPrio2: this.enhanceDiagnoses(diagnoses.notMatchedPrio2),
              notMatchedPrio3: this.enhanceDiagnoses(diagnoses.notMatchedPrio3),
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
