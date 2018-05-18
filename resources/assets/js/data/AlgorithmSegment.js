import React from 'react';

/**
 * This class adds methods to the diagnosis segments.
 */
export default class AlgorithmSegment {
  /**
   * Generates a random hexadecimal string to be used temporarily as a unique key
   */
  static random() {
    return Math.floor((1 + Math.random()) * 0x100000000000).toString(16);
  }

  getComponent(evaluator, handleClick, diagnoses) {
    if (this.operator === 'leaf') {
      let color = 'black';
      let status = '';
      if (this.type === 'diagnosis') {
        if (evaluator.evaluated[this.id]) {
          color = 'red';
          status = ' (met)';
        } else {
          color = 'green';
          status = ' (not met)';
        }
      }
      let explanation = '';
      if (typeof diagnoses.get(this.id) !== 'undefined') {
        if (diagnoses.get(this.id).explanation !== '') {
          explanation = 'Explanation: ' + diagnoses.get(this.id).explanation;
        }
      }
      return (
        <li key={this.id + AlgorithmSegment.random()}>
          <span
            style={{ color: color, cursor: 'pointer' }}
            onClick={() => handleClick(this.id)}
          >
            {this.id + status}
          </span>
          <br />
          <span style={{ fontSize: '70%', fontWeight: 'bold' }}>
            {explanation}
          </span>
        </li>
      );
    } else {
      return (
        <ul key={AlgorithmSegment.random()}>
          {Object.keys(this.children).map(alg => {
            return this.children[alg].getComponent(
              evaluator,
              handleClick,
              diagnoses
            );
          })}
        </ul>
      );
    }
  }

  getCompositeId() {}
}
