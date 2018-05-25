import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { setActiveItem, setResponse, setNote } from '../actions';
import { ItemCard } from './ItemCard';
import { validateNumeric } from '../lib/helpers';
import { Markdown } from './Markdown';

const Response = ({ items, dispatch, interview }) => {
  const item = items.find(item => item.key === interview.activeKey);
  if (!item) {
    return <div>No item found</div>;
  }
  let input = item.input;
  if (input === 'integer') {
    input = 'number';
  }
  if (input === 'string') {
    input = 'text';
  }

  const response = (interview.responses && interview.responses[item.key]) || '';
  const note = (interview.notes && interview.notes[item.key]) || '';
  const hasInput = input || item.scale;

  return (
    <div key={item.key} style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <ItemCard item={item} />
        {item.options &&
          Object.keys(item.options).map(key => (
            <div key={key} onClick={() => dispatch(setResponse(item.key, key))}>
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
                  dispatch(setResponse(item.key, event.target.value));
                } else if (!item.validate) {
                  dispatch(setResponse(item.key, event.target.value));
                }
              }}
              placeholder={`Allowed responses: ${item.validate}`}
              value={response}
              autoFocus
            />

            <textarea
              onChange={event =>
                dispatch(setNote(item.key, event.target.value))
              }
              defaultValue={note}
              placeholder="Note"
            />
          </Fragment>
        )}
      </div>
      <div className="interview-item-glossary">
        <strong>Glossary</strong>
        <Markdown source={item.glossary} />
      </div>
    </div>
  );
};

export const ResponseContainer = connect(state => state)(Response);
