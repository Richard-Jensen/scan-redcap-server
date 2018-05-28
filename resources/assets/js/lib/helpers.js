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
      if (rule === value) {
        valid = true;
      }
    } else if (
      // if the rule is a number we check it against the value provided
      typeof rule === 'number' &&
      (rule === parseInt(value, 10) || rule.toString().includes(value))
    ) {
      valid = true;
    }
  });

  return valid;
};
