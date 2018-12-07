/**
 * The algorithms are resolved recursively.
 * If a leaf contains a reference to a diagnosis or algorithm not yet resolved,
 * the calculate method is called. The results are stored as properties directly
 * on this object. This ensures that no counter or diagnosis are resolved more
 * than once.
 */
 export default class Evaluator {
  // a: 0;

  /**
   * Set/import the object containing the previous calculated diagnoses
   * This might not be necessary at all.
   * They result in an infinite loop, still not sure why...
   */
  // set diagnoses(diagnoses) {
  //   this.diagnoses = diagnoses;
  // }

  // get diagnoses() {
  //   return this.diagnoses;
  // }

  constructor(algorithms) {
    this.algorithms = algorithms;
    this.evaluated = {};
    this.missing = {};
    this.matched = {};
    this.matchedPrio1 = {};
    this.matchedPrio2 = {};
    this.matchedPrio3 = {};
    this.notMatched = {};
    this.notMatchedPrio1 = {};
    this.notMatchedPrio2 = {};
    this.notMatchedPrio3 = {};
    this.formattedAlgorithms = {};
  }

  /**
   * Recursive function to avaluate the boolean value of a part of the algorithm
   * structure (including the root algorithm for a diagnosis)
   *
   * @param  object/string value The leaf or algorithm structure
   * @return boolean
   */
  // process(value) {
  //   if ( typeof value === 'object' ) {
  //     if ( Object.keys(value)[0] === 'AND' ) {
  //       return this.and(value['AND']);
  //     }
  //     if ( Object.keys(value)[0] === 'OR' ) {
  //       return this.or(value['OR']);
  //     }
  //     if ( Object.keys(value)[0] === 'XOR' ) {
  //       return this.xor(value['XOR']);
  //     }
  //     if ( Object.keys(value)[0] === 'SUM' ) {
  //       return this.sum(value['SUM']);
  //     }
  //   }
  //   return this.leaf(value);
  // }
  process(component, diagnosis) {
    let operator = component.operator.toLowerCase();
    return this[operator](component, diagnosis);
  }

  /**
   * If we are to be able to list diagnoses with incomplete dependencies, we
   * have to look at every leaf. The solution is thus to save the output as a
   * variable and return it in the end at the cost of performance.
   *
   * We still don't have a way to list partially fulfilled criteria, for that we
   * have to store all the values where the check fails. We should do this
   * perhaps in another function altogether, and revert this one back to the
   * efficient method.
   *
   * How do we do this, and only show those which are relevant?
   *
   * @see issue #15
   */
   and(component, diagnosis) {
    // console.log('AND');
    // console.log(array);

    let r = true;
    for (let value of component.children) {
      if (!this.process(value, diagnosis)) {
        r = false;
        // return false;
      }
    }
    return r;
  }

  /**
   * If we are to be able to list diagnoses with incomplete dependencies, we
   * have to look at every leaf. The solution is thus to save the output as a
   * variable and return it in the end at the cost of performance.
   *
   * We still don't have a way to list partially fulfilled criteria, for that we
   * have to store all the values where the check fails. We should do this
   * perhaps in another function altogether, and revert this one back to the
   * efficient method.
   *
   * How do we do this, and only show those which are relevant?
   *
   * @see issue #15
   */
   or(component, diagnosis) {
    // console.log('OR');
    // console.log(array);

    let r = false;
    for (let value of component.children) {
      if (this.process(value, diagnosis)) {
        r = true;
        // return true;
      }
    }
    return r;
  }

  /**
   * Multiinput exclusive or.
   * If exactly one of the values in the input array evaluates to true, this
   * method returns true.
   */
   xor(component, diagnosis) {
    // console.log('XOR');
    // console.log(array);

    let r = false;
    let s = true;
    for (let value of component.children) {
      if (this.process(value, diagnosis)) {
        s ? (r = true) : (r = false);
        s = false;
      }
    }
    return r;
  }

  sum(component, diagnosis) {
    // console.log('SUM');
    // console.log(array);

    let r = 0;
    for (let value of component.children) {
      let part = this.process(value, diagnosis);
      if (typeof part === 'boolean') {
        if (part) {
          r++;
        }
      }
      if (typeof part === 'number') {
        r += part;
      }
    }
    // console.log(r);
    return r;
  }

  /**
   * Evaluate the leaf expression into a boolean value.
   *
   * The input must have the structure:
   *     <variable> <operator> <value>
   * The <operator> and <value> can be omitted, in that case the boolean value
   * of the <variable> is returned if possible.
   *
   * <variable> is a string starting with the following characters:
   * $  question answer
   * $! diagnosis
   * $@ counter
   *
   * <operator> is one of the following:
   * (strict/typesafe) equality:     ===
   * (loose) equality:               == , =
   * Numerical comparison:           <, >, <=, >=
   * (strict/typesafe) non-equality: !==
   * (loose) non-equality:           !=, <>, ~=
   *
   * <value> must be JSON-parsable. For example:
   * true, false, 7, [1,2,3], 'string', null, undefined, NaN
   *
   * If we test the variable for equality or compare against an array, the
   * expression evaluates to true if one of the elements is a match. If we test
   * for inequality against an array the expression evaluates to true if all the
   * elements are different from the variable.
   *
   * @throws TypeError           If leaf is not a string (or boolean)
   * @throws TypeError           If the variable is invalid
   * @throws TypeError           If the operator is invalid
   * @param  boolean/string leaf The leaf expression.
   *                             We allow boolean values for now
   * @return boolean             The value of the leaf
   */
   leaf(component, diagnosis) {
    // This is for easy testing.
    if (typeof component.expression === 'boolean') {
      return component.expression;
    }

    if (typeof component.expression !== 'string') {
      // TODO Do something to handle this
      throw new TypeError('The algorithm leaf expression is not a string.');
    }

    let arr = component.expression.split(/\s/);
    let variable = undefined;
    let operator = undefined;
    let values = undefined;

    // The first word in the leaf is a question answer identifier ($\d)
    // Use /^\$\d+\.\d*$/ for a more restrictive regex
    if (arr[0].search(/^\$\d/) !== -1) {
      component.id = arr[0].substring(1);
      component.type = 'answer';
      component.identifier = '$\\d';
      variable = this.lookup(component, diagnosis); //arr[0].substring(1));
      // console.log('This is a question answer: ' + arr[0] + ' and the value is ' + variable);
    }

    // The first word in the leaf is a diagnosis identifier ($!)
    if (arr[0].search(/^\$!/) !== -1) {
      component.id = arr[0].substring(2);
      component.type = 'diagnosis';
      component.identifier = '$!';
      variable = this.lookup(component, diagnosis); //arr[0].substring(2));
      // console.log('This is a diagnosis: ' + arr[0] + ' and the value is ' + variable);
    }

    // The first word in the leaf is a counter ($@)
    if (arr[0].search(/^\$@/) !== -1) {
      component.id = arr[0].substring(2);
      component.type = 'diagnosis';
      component.identifier = '$@';
      variable = this.lookup(component, diagnosis); //arr[0].substring(2));
      // console.log('This is a counter: ' + arr[0] + ' and the value is ' + variable);
    }

    // The first word in the leaf is a ??? ($$)
    // All these refer to a question with an ICD-10 diagnosis, and all of them
    // tests if the answer is different from the empty string.
    // It is possible that this .js algorithm can handle this just fine with a
    // simple lookup, so that's what we are doing here for a start.
    if (arr[0].search(/^\$\$/) !== -1) {
      // We need an offset of 2 to compensate for the extra control character
      component.id = arr[0].substring(2);
      component.type = 'answer';
      component.identifier = '$$';
      variable = this.lookup(component, diagnosis); //arr[0].substring(2));
      // console.log('This is a $$: ' + arr[0] + ' and the value is ' + variable);
    }

    // The first word in the leaf is a ??? ($#)
    // All these refer to a question with an ICD-10 diagnosis, and all of them
    // tests if the answer is equal to or different from a string.
    // It is possible that this .js algorithm can handle this just fine with a
    // simple lookup, so that's what we are doing here for a start.
    //
    // All the compared strings are either F1 or F, and there are a lot of
    // F-diagnoses in ICD-10. Perhaps we need another operator, 'like',
    // 'notlike', 'contains', 'missing' or similar.
    if (arr[0].search(/^\$#/) !== -1) {
      // We need an offset of 2 to compensate for the extra control character
      component.id = arr[0].substring(2);
      component.type = 'answer';
      component.identifier = '$#';
      variable = this.lookup(component, diagnosis); //arr[0].substring(2));
      // console.log('This is a $#: ' + arr[0] + ' and the value is ' + variable);
    }

    // If the first word in the leaf doesn't begin with '$', try to parse it.
    // (This could for example be strings like '1' instead of true)
    if (arr[0].search(/^[^$]/) !== -1) {
      variable = JSON.parse(arr[0]);
    }

    // If the variable type is invalid or not recognized
    if (typeof variable === 'undefined') {
      console.log('Test: ' + arr[0] + ', Type:' + typeof arr[0]);
      throw new TypeError('The variable is invalid: ' + arr[0]);
    }

    // If no operator is found, return the boolean value of the variable
    if (typeof arr[1] === 'undefined') {
      if (typeof variable === 'boolean' || typeof variable === 'number') {
        return variable;
      } else {
        console.log(
          'Undefined operator: ' + arr[0] + ' Variable: ' + typeof variable
          );
        return;
      }
    }

    // Parse the operator
    let allowedOperators = /^===$|^==$|^=$|^<$|^>$|^<=$|^>=$|^!==$|^!=$|^<>$|^~=$/;
    if (typeof arr[1] !== 'string' || arr[1].search(allowedOperators) === -1) {
      // Do something to handle this
      throw new TypeError('This operator is invalid: ' + arr[1]);
    }
    operator = arr[1];
    // console.log('This is the operator: ' + arr[1]);

    // JSON parse
    if (arr[2]) {
      if (arr[2].search(/^\$\d/) !== -1) {
        // Handles the case where one question answer needs to be
        // compared to another
        values = this.lookupAnswer(arr[2].substring(1));
      } else {
        // Parse the values
        values = JSON.parse(arr[2]);
      }

      // Literals are packed in an array to simplify the loops below
      if (typeof values !== 'object') {
        values = [values];
      }
    }

    let evaluateLeafExpression = {
      '===': function(variable, values) {
        let r = false;
        for (let value of values) {
          if (variable === value) {
            r = true;
          }
        }
        return r;
      },
      '==': function(variable, values) {
        let r = false;
        for (let value of values) {
          if (variable === value) {
            r = true;
          }
        }
        return r;
      },
      '=': function(variable, values) {
        let r = false;
        for (let value of values) {
          if (variable === value) {
            r = true;
          }
        }
        return r;
      },
      '<': function(variable, values) {
        let r = false;
        for (let value of values) {
          if (variable < value) {
            r = true;
          }
        }
        return r;
      },
      '>': function(variable, values) {
        let r = false;
        for (let value of values) {
          if (variable > value) {
            r = true;
          }
        }
        return r;
      },
      '<=': function(variable, values) {
        let r = false;
        for (let value of values) {
          if (variable <= value) {
            r = true;
          }
        }
        return r;
      },
      '>=': function(variable, values) {
        let r = false;
        for (let value of values) {
          if (variable >= value) {
            r = true;
          }
        }
        return r;
      },
      '!==': function(variable, values) {
        let r = true;
        for (let value of values) {
          if (variable === value) {
            r = false;
          }
        }
        return r;
      },
      '!=': function(variable, values) {
        let r = true;
        for (let value of values) {
          if (variable === value) {
            r = false;
          }
        }
        return r;
      },
      '<>': function(variable, values) {
        let r = true;
        for (let value of values) {
          if (variable === value) {
            r = false;
          }
        }
        return r;
      },
      '~=': function(variable, values) {
        let r = true;
        for (let value of values) {
          if (variable === value) {
            r = false;
          }
        }
        return r;
      },
      undefined: function(variable, values) {
        throw new TypeError('The operator is undefined');
      }
    };

    let r = evaluateLeafExpression[operator](variable, values);

    // console.log(
    //   'operator: ' + operator + ' ' +
    //   'variable: ' + variable + ' ' +
    //   'values: '   + values   + ' ' +
    //   'boolean: '  + r        + ' '
    // );

    return r;
  }

  /**
   * Lookup the answer value of the given id
   * The found value is given to the JSON parser before return, i.e. a string
   * with a number becomes an int, the string 'true' is the boolean etc.
   *
   * @param  string id The answer ID
   * @return mixed     The JSON-parsed value or false if not found.
   */
   lookupAnswer(id) {
    // console.log(id);
    if (typeof this.answers[id] === 'undefined') {
      // console.log('The answer with ID: ' + id + ' is undefined');
      return false;
      // If we throw exceptions here we'll not get the diagnosis id as a
      // property on the diagnosis object.
      // throw new ReferenceError('The answer with ID: ' + id + ' is undefined');
    }
    return JSON.parse(this.answers[id]);
  }

  /**
   * Calculate a root branch when encountered as a leaf.
   * The value is only calculated if it can't be found (undef) as a property of
   * this object.
   *
   * @param  string      id The ID of the diagnosis/counter
   * @return boolean/int    The value of the
   */
  // lookupAlgorithm(id) {

  //   // Calculate
  //   if ( typeof this.evaluated[id] === 'undefined' ) {

  //     // Should we do a more explicit check here?
  //     // Not necessary, all objects evaluate to true.
  //     // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling
  //     if ( this.getAlgorithm(id) ) {
  //       this.evaluated[id] = this.process(this.getAlgorithm(id));
  //     }
  //     else {
  //       // The diagnosis doesn't exist in the algorithm set. Give a warning.
  //       // console.log('The diagnosis: ' + id + ' isn\'t defined')
  //       return false;
  //     }
  //   }

  //   // Lookup
  //   return this.evaluated[id];
  // }

  lookup(component, diagnosis) {
    let self = this;
    if (component.type === 'answer') {
      if (typeof self.answers[component.id] === 'undefined') {
        component.status = 'missing';
        /*console.log('The answer with ID: ' + component.id + ' is undefined');*/
        return false;
        // If we throw exceptions here we'll not get the diagnosis id as a
        // property on the diagnosis object.
        // throw new ReferenceError('The answer with ID: ' + id + ' is undefined');
      }
      // return JSON.parse(self.answers[component.id]);
      try {
        return JSON.parse(self.answers[component.id]);
      } catch (e) {
        /*console.log('JSON error. Diagnosis: ' + diagnosis + ' Component: ' + component + ' Message: ' + e.message);*/
        console.log(diagnosis);
        console.log(component);
        console.log(e);
        return '';
      }
    }
    if (component.type === 'diagnosis') {
      // console.log(component);
      // Calculate
      if (typeof self.evaluated[component.id] === 'undefined') {
        // Should we do a more explicit check here?
        // Not necessary, all objects evaluate to true.
        // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling
        if (self.getAlgorithm(component)) {
          self.evaluated[component.id] = self.process(
            self.getAlgorithm(component),
            diagnosis
            );
        } else {
          component.status = 'missing';
          // The diagnosis doesn't exist in the algorithm set. Give a warning.
          /*console.log('The diagnosis: ' + component.id + ' isn\'t defined')*/
          return false;
        }
      }

      // Lookup
      return self.evaluated[component.id];
    }
  }

  /**
   * Find the attached algorithm to the given id if it exists
   * @param  string         id The ID of the diagnosis/counter
   * @return object/boolean    The algorithm object if it exists,
   *                           false otherwise
   */
   getAlgorithm(component, diagnosis) {
    if (typeof this.algorithms.get(component.id) !== 'object') {
      // console.log(component);
      // TODO: Per needs to add more diagnoses. To bug test, unignore the followinf console log:
      /*console.warn(
        'The diagnosis with id: ' +
        component.id +
        ' does not exist in the diagnosis set'
        );*/
      // TODO The id doesn't have an entry in the algorithm set.
      // Give the appropriate warning/error
      return false;
    }

    if (typeof this.algorithms.get(component.id).algorithm !== 'object') {
      console.warn(
        'The diagnosis with id: ' +
        component.id +
        ' does not have a well formed algorithm attached'
        );
      // TODO The id doesn't have a well formed algorithm attached.
      // Give the appropriate warning/error
      return false;
    }

    // NOTE If we need a more rigorous check here to see if the Algorithm is
    // well formed, that code should be placed in process, since not
    // all calls to that go through this function

    // Return the algorithm object
    return this.algorithms.get(component.id).algorithm; //[0]
  }
}
