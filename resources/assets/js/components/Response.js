import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { setActiveItem, setResponse, setNote } from '../actions';
import { ItemCard } from './ItemCard';
import { validateNumeric, isValueWithinWholeRangeOfRules, findClosestViableValueFromInvalidValue, selectValueBasedOnInputValue } from '../lib/helpers';
import { Markdown } from './Markdown';
import { items, scales, getItemByKey } from '../items';
var previousValue = 0;

const Response = ({ dispatch, interview, settings }) => {
  let item = getItemByKey(interview.activeKey);

  if (!item) {
    return <div>No item found</div>;
  }
  let input = item.input;

  let hasScale = item.scale;
  if (hasScale && scales[item.scale]) {
    const scale = scales[item.scale];
    item = {
      ...item,
      options: scale.options,
      validate: scale.validate,
      input: scale.input
    };
  }

  let hasPeriods = true; // default periods to true
  if (item.periods === 'false') hasPeriods = false;
  if (input === 'date' || input === 'date_interval') {
    hasPeriods = false;
  }

  if (input === 'integer') {
    input = 'number';
  }
  if (input === 'string') {
    input = 'text';
  }

  let response = (interview.responses && interview.responses[item.key]) || '';

  const note = (interview.notes && interview.notes[item.key]) || '';
  const hasInput = input || item.scale;
  const showGlossary = settings.showGlossary && item.glossary;

  return (
    <div key={item.key} className="interview-item-container">
      <div style={{ flex: 1 }}>
        <ItemCard item={item} />
        {item.options &&
          Object.keys(item.options).map(key => (
            <div
              key={key}
              className="interview-response-list"
              onClick={() =>
                dispatch(setResponse({ key: item.key, value: key }))
              }
            >
              <b>{key}</b>{' '}
              {key === response ? (
                <b>{item.options[key]}</b>
              ) : (
                item.options[key]
              )}
            </div>
          ))}
        {item.scale && (
          <div>
            Scale: <strong>{item.scale}</strong>
          </div>
        )}
        {hasInput && (
          <Fragment>
            <label htmlFor="response">Response</label>
            <input
              type={input}
              className={`interview-input interview-input-${input}`}
              id="ResponseInput"
              name="response"
              onKeyDown={event =>{
                if(event.keyCode==38){
                console.log("test Arrow UP");
                console.log(event.target.value)
                if (item.validate && validateNumeric(event.target.value, item.validate)) {
                  dispatch(
                    setResponse({
                      key: item.key,
                      value: event.target.value
                    })
                  );
                } else if (!item.validate) {
                  dispatch(
                    setResponse({
                      key: item.key,
                      value: event.target.value
                    })
                  );
                  }
              }
                else if (event.keyCode==40)
                console.log("test Arrow DOWN")
                if (item.validate && validateNumeric(event.target.value, item.validate)) {
                  dispatch(
                    setResponse({
                      key: item.key,
                      value: event.target.value
                    })
                  );
                } else if (!item.validate) {
                  dispatch(
                    setResponse({
                      key: item.key,
                      value: event.target.value
                    })
                  );
                event.preventDefault();
                }
              }}
              onChange={event => {
                console.log("ONCHANGE")
                if (item.validate && validateNumeric(event.target.value, item.validate)) {
                  dispatch(
                    setResponse({
                      key: item.key,
                      value: event.target.value
                    })
                  );
                } else if (!item.validate) {
                  dispatch(
                    setResponse({
                      key: item.key,
                      value: event.target.value
                    })
                  );
                }}}
              placeholder={item.validate}
              value={response}
              autoFocus
            />

            {settings.showItemNotes && (
              <textarea
                onChange={event =>
                  dispatch(
                    setNote({ key: item.key, value: event.target.value })
                  )
                }
                defaultValue={note}
                placeholder="Note"
              />
            )}
          </Fragment>
        )}
      </div>
      {showGlossary && (
        <div className="interview-item-glossary">
          <strong>Glossary</strong>
          <Markdown source={item.glossary} style={{ height: '100%' }} />
        </div>
      )}
    </div>
  );
};

export const ResponseContainer = connect(state => state)(Response);
    const manualInputChange = (value,valid) =>{
                if (
                  valid &&
                  validateNumeric(value, valid)
                ) {
                  dispatch(
                    setResponse({
                      key: item.key,
                      value: value
                    })
                  );
                } else if (!valid) {
                  dispatch(
                    setResponse({
                      key: item.key,
                      value: value
                    })
                  );
                }
    };
