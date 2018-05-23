import DataLoader from './DataLoader';

export default class Main {
  static runAlgorithms(responses = {}, algorithms) {
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
    evaluator.answers = removeEmpty(evaluator.answers);

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

      if (evaluator.evaluated[key] === true) {
        evaluator.matched[key] = diagnosis;
        // console.log(yaml.safeDump(diagnosis, {flowLevel: 1}));
      } else {
        evaluator.notmatched[key] = diagnosis;
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

  /**
   * Test the output by doing something.
   */
  static doSomething(evaluator) {
    // console.log('Matched items:', evaluator.matched);
    // const diagnosisVariableItems = Object.keys(evaluator.matched).reduce(
    //   (result, item) => {
    //     const matchedItem = evaluator.matched[item]
    //     if (matchedItem.diagnosis_variable
    //     && matchedItem.icd10) {
    //       return {
    //         ...result,
    //         [item]: evaluator.matched[item]
    //       }
    //     }
    //     return result
    //   },
    //   {}
    // );
    // console.log(diagnosisVariableItems)
    // for (let key of evaluator.matched) {
    //
    // }
    // // Sort evaluator.matched
    // const ordered = {};
    // Object.keys(evaluator.matched).sort().forEach(key => ordered[key] = evaluator.matched[key])
    // evaluator.matched = ordered;
    // // Print evaluator.matched
    // for ( let key in evaluator.matched ) {
    //   if ( evaluator.matched.hasOwnProperty(key) ) {
    //     let message;
    //     message = key;
    //     if ( evaluator.matched[key].explanation.length > 0 ) {
    //       message += ' - ' + evaluator.matched[key].explanation;
    //     }
    //     if ( message.length ) {
    //       console.log(message);
    //     }
    //   }
    // }
    // console.log(evaluator);
    // console.log('Counters:', counter);
    // console.log('Matched items:', matchedItems);
    // // Sort matchedItems
    // const ordered = {};
    // Object.keys(matchedItems).sort().forEach(key => ordered[key] = matchedItems[key])
    // matchedItems = ordered;
    // // Print matchedItems
    // for ( let key in matchedItems ) {
    //   if ( matchedItems.hasOwnProperty(key) ) {
    //     let message;
    //     message = key;
    //     if ( matchedItems[key].explanation.length > 0 ) {
    //       message += ' - ' + matchedItems[key].explanation;
    //     }
    //     if ( message.length ) {
    //       // console.log(message);
    //     }
    //   }
    // }
  }
}
