import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { setActiveItem, setResponse, setNote } from '../actions';
import { ItemCard } from './ItemCard';
import { validateNumeric } from '../lib/helpers';
import { Markdown } from './Markdown';
import { items, scales, getItemByKey } from '../items';

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

  let one, two;
  if (hasPeriods) {
    response = (interview.responses && interview.responses[item.key]) || {};
    one = response.period_one;
    two = response.period_two;
  }

  const note = (interview.notes && interview.notes[item.key]) || '';
  const hasInput = input || item.scale;

  return (
    <div key={item.key} style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <ItemCard item={item} />
        {item.options &&
          Object.keys(item.options).map(key => (
            <div
              key={key}
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
            {hasPeriods && (
              <Fragment>
                <label htmlFor="period_one">Period 1</label>
                <input
                  type={input}
                  name="period_one"
                  onChange={event => {
                    if (
                      item.validate &&
                      validateNumeric(event.target.value, item.validate)
                    ) {
                      dispatch(
                        setResponse({
                          key: item.key,
                          value: event.target.value,
                          period: 1
                        })
                      );
                    } else if (!item.validate) {
                      dispatch(
                        setResponse({
                          key: item.key,
                          value: event.target.value,
                          period: 1
                        })
                      );
                    }
                  }}
                  placeholder={`Allowed responses: ${item.validate}`}
                  value={one}
                  autoFocus
                />

                <label htmlFor="period_two">Period 2</label>
                <input
                  type={input}
                  name="period_two"
                  onChange={event => {
                    if (
                      item.validate &&
                      validateNumeric(event.target.value, item.validate)
                    ) {
                      dispatch(
                        setResponse({
                          key: item.key,
                          value: event.target.value,
                          period: 2
                        })
                      );
                    } else if (!item.validate) {
                      dispatch(
                        setResponse({
                          key: item.key,
                          value: event.target.value,
                          period: 2
                        })
                      );
                    }
                  }}
                  placeholder={`Allowed responses: ${item.validate}`}
                  value={two}
                />
              </Fragment>
            )}

            {!hasPeriods && (
              <Fragment>
                <label htmlFor="response">Response</label>
                <input
                  type={input}
                  name="response"
                  onChange={event => {
                    if (
                      item.validate &&
                      validateNumeric(event.target.value, item.validate)
                    ) {
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
                  }}
                  placeholder={`Allowed responses: ${item.validate}`}
                  value={response}
                  autoFocus
                />
              </Fragment>
            )}

            <textarea
              onChange={event =>
                dispatch(setNote({ key: item.key, value: event.target.value }))
              }
              defaultValue={note}
              placeholder="Note"
            />
          </Fragment>
        )}
      </div>
      {settings.showGlossary && (
        <div className="interview-item-glossary">
          <strong>Glossary</strong>
          <Markdown source={item.glossary} />
        </div>
      )}
    </div>
  );
};

export const ResponseContainer = connect(state => state)(Response);
