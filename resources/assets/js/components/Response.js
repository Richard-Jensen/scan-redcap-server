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

  const note = (interview.notes && interview.notes[item.key]) || '';
  const hasInput = input || item.scale;
  const showGlossary = settings.showGlossary && item.glossary;

  return (
    <div key={item.key} style={{ display: 'flex', padding: 32 }}>
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
              placeholder={
                item.validate && `Allowed responses: ${item.validate}`
              }
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
          <Markdown source={item.glossary} />
        </div>
      )}
    </div>
  );
};

export const ResponseContainer = connect(state => state)(Response);
