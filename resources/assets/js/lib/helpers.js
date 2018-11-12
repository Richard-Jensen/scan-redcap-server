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
  }
  else if (typeof rule === 'string') {
    if (rule === value.toString()) {
      valid = true;
    }
  }
  else if (typeof rule === 'number' &&
    (rule === parseInt(value, 10) || rule.toString().includes(value))
    ) {
    // if the rule is a number we check it against the value provided
    valid = true;
  }
});
return valid;
};


export const isValueWithinWholeRangeOfRules = (value, rules) => {

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

export const monthsToYears = (months) => {
  let years = 0;
  let counter = months;
  while (counter >= 12) {
    years++;
    counter = counter - 12;
  }
  return (years + ' år  og ' + counter +  ' måneder')
}



