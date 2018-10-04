import Diagnosis from './Diagnosis';
import AlgorithmSegment from './AlgorithmSegment';
import Evaluator from './Evaluator';

export default class DataLoader {
  static getEvaluator(diagnoses) {
    const algorithms = this.generateAlgorithms(this.loadDiagnoses(diagnoses));
    const evaluator = new Evaluator(algorithms);
    return evaluator;
  }

  static loadDiagnoses(diagnoses) {
    return new Map(Object.entries(diagnoses));
  }

  static generateAlgorithms(diagnoses) {
    let algorithms = new Map();

    const workCopy = JSON.parse(JSON.stringify([...diagnoses]));

    for (let [key, item] of workCopy) {
      // Change the object type to Diagnosis
      let diagnosis = Object.assign(new Diagnosis(), item);
      // Add the name as a property
      diagnosis.key = key;
      // Change the object structure of algorithms
      diagnosis.algorithm = this.generateAlgorithmSegments(
        diagnosis.algorithm[0]
      );

      // Debug
      if (
        false ||
        key === 'F06F32C5'
        // || key === 'OPDEP.counter'
        // || key === 'F00.1.1'
        // || key === 'AGORA'
        // || key === 'AGORA.A'
      ) {
        diagnosis.debug = true;
      }

      // Update the value
      algorithms.set(key, diagnosis);
    }
    return algorithms;
  }

  /**
   * Turn the loaded algorithms into a more managable structure
   */
  static generateAlgorithmSegments(value, parent = {}) {
    // let self = this;
    if (typeof value === 'object') {
      let alg = new AlgorithmSegment();
      alg.operator = Object.keys(value)[0];
      alg.children = value[alg.operator];
      alg.children.forEach(function(element, index, arr) {
        arr[index] = DataLoader.generateAlgorithmSegments(element, alg);
      });
      alg.parent = parent;
      return alg;
    }
    if (typeof value === 'string' || typeof value === 'boolean') {
      let alg = new AlgorithmSegment();
      alg.operator = 'leaf';
      alg.expression = value;
      alg.parent = parent;
      return alg;
    }
  }
}
