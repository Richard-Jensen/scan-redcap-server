      export const isTextareaInFocus = () =>
      document.activeElement.tagName === 'TEXTAREA';

      // the value provided can be a string or a number
      // rules look like [0-10, 98, 99]
      export const validateNumeric = (value, rules) => {
      let valid = false;
      // allow empty input
      if (value === '') return true;
      rules.forEach(rule => {
        // if the validator contains an interval string (like "0-10") we parse the
        // numbers and check if the value is included in the interval
        if (typeof rule === 'string' && rule.includes('-')) {
          var range = rule.split('-').map(n => parseInt(n, 10));

          if (value >= range[0] && value <= range[1]) {
            valid = true;
          }
        } else if (typeof rule === 'string') {
          if (rule === value.toString()) {
            valid = true;
          }
        } else if (typeof rule === 'number' &&
          (rule === parseInt(value, 10) || rule.toString().includes(value))
        ) {
          // if the rule is a number we check it against the value provided
          valid = true;
        }
      });
      return valid;
      };
      //TODO rename func MRJ
      //Brute forces a search for available options, then entering a non valid value into input; Based on it's own position, it will go high, then low, and then go for the option that it does NOT remember it has been; IE the old value
      export const findClosestViableValueFromInvalidValue = (value, rules) =>{
      var nearest_high = parseInt(value,10);
      var nearest_low = parseInt(value,10);
      while(!validateNumeric(nearest_high,rules))  {
          nearest_high++;
          if (nearest_high>20)
            return false;
      }
      while(!validateNumeric(nearest_low,rules)){
          nearest_low--;
          if (nearest_low<-2)
            return false;
      }
      return [nearest_low,nearest_high];
      };

      export const selectValueBasedOnInputValue = (values, oldValue)  =>{
      /*if ((values[1]-values[0]=2)
        return
        return values[1];
      else if (oldValue = values[1])
        return values[0];*/

    };

    export const isValueWithinWholeRangeOfRules = (value, rules) =>{

      var high=0;
      var low=100;
      rules.forEach(rule => {
        // if the validator contains an interval string (like "0-10") we parse the
        // numbers and check if the value is included in the interval
        if (typeof rule === 'string' && rule.includes('-')) {
          var range = rule.split('-').map(n => parseInt(n, 10));
            if (low > range[0])
              {low = range[0];}
            if (high < range[0])
              {high = range[0];}
            if (low > range[1])
              {low = range[1];}
            if (high < range[1])
              {high = range[1];}
        } else if (typeof rule === 'string') {
            rule === parseInt(value, 10)
            if (low > rule)
              {low = rule;}
            if (high < rule)
              {high = rule;}
        } else if (
          // if the rule is a number we check it against the value provided
          typeof rule === 'number' &&
          (rule === parseInt(value, 10) || rule.toString().includes(value))
        ) {
          if (low > rule)
            {low = rule;}
          if (high < rule)
            {high = rule;}
        }
      });
        value = parseInt(value,10);
        high = parseInt(high,10);
        low = parseInt(low,10);
      if (value >= low && value <= high){
          return true;
        }
      else {
          return false;
        }

      };
