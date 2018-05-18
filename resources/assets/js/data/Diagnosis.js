/**
 * This class adds methods to the diagnosis objects.
 */
export default class Diagnosis {
  firstThree() {
    return this.explanation.substring(0, 3);
  }
  isCounter() {
    if (this.algorithm.operator === 'SUM') {
      return true;
    }
  }
}
