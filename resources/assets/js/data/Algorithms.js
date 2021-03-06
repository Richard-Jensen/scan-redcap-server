import DataLoader from './DataLoader';

export default class Algorithms {
  static run(responses = {}, algorithms) {
    // Get the evaluator object from the loader
    let evaluator = DataLoader.getEvaluator(algorithms);

    // Populate the evaluator object with answers
    evaluator.answers = Object.keys(responses).reduce(
      (result, item) => ({
        ...result,
        [item]: responses[item]
      }),
      {}
      );

    // Remove empty answers.
    const removeEmpty = obj => {
      Object.entries(obj).forEach(([key, val]) => {
        if (val && typeof val === 'object') {
          removeEmpty(val);
        } else if (val !== null) {
          if (val.length === 0) {
            delete obj[key];
          }
        }
      });
      return obj;
    };

    // Process all diagnoses
    for (let [key, diagnosis] of evaluator.algorithms) {
      // Calculate the diagnosis value only if we haven't done it before.
      if (typeof evaluator.evaluated[key] === 'undefined') {
        //!== 'boolean'
        try {
          evaluator.evaluated[key] = evaluator.process(
            diagnosis.algorithm,
            diagnosis
            );
        } catch (e) {
          if (diagnosis.debug) {
            console.log(diagnosis);
          }

          diagnosis.errorMessage = e.message;
          evaluator.missing[key] = diagnosis;

          console.log(e.name + ': ' + e.message + '. diagnosis: ' + key);
          console.log(e);
        }
      }

      if (diagnosis.debug) {
        // console.log(diagnosis);
      }

      evaluator.formattedAlgorithms[key] =  diagnosis;
      const prio = evaluator.algorithms.get(key).priority;
      if (evaluator.evaluated[key] === true) {
        if (prio === '1') {
          evaluator.matchedPrio1[key] = diagnosis;
        }
        else if (prio === '2') {
          evaluator.matchedPrio2[key] = diagnosis;
        }
        else if (prio === '3') {
          evaluator.matchedPrio3[key] = diagnosis;
        }
        evaluator.matched[key] = diagnosis;
      }
      // console.log(yaml.safeDump(diagnosis, {flowLevel: 1}));
      else {
        if (prio === '1') {
          evaluator.notMatchedPrio1[key] = diagnosis;
        }
        else if (prio === '2') {
          evaluator.notMatchedPrio2[key] = diagnosis;
        }
        else if (prio === '3') {
          evaluator.notMatchedPrio3[key] = diagnosis;
        }
        evaluator.notMatched[key] = diagnosis;
      }
    }

    // Calculate the result set from the filter options in state
    evaluator.resultSet = this.filterMatchedItems(
      { options: false },
      evaluator
      );



    return evaluator;
  }

  static filterMatchedItems(evaluatorOptions, evaluator) {
    const options = evaluatorOptions;

    const diagnosisVariableItems = Object.keys(evaluator.matched).reduce(
      (result, item) => {
        const matchedItem = evaluator.matched[item];

        if (options.icd) {
          if (matchedItem.diagnosis_variable && matchedItem.icd10) {
            return {
              ...result,
              [item]: evaluator.matched[item]
            };
          }
        } else {
          if (matchedItem.diagnosis_variable) {
            return {
              ...result,
              [item]: evaluator.matched[item]
            };
          }
        }

        return result;
      },
      {}
      );

    return diagnosisVariableItems;
  }
}
