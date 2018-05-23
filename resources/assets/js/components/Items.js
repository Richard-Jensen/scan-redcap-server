import React from 'react';
import { connect } from 'react-redux';
import { setActiveItem, setResponse, setNote } from '../actions';
import { ItemCard } from './ItemCard';

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

  return (
    <div key={item.key}>
      <ItemCard item={item} />
      {item.options &&
        Object.keys(item.options).map(key => (
          <div key={key} onClick={() => dispatch(setResponse(item.key, key))}>
            <b>{key}</b> {item.options[key]}
          </div>
        ))}
      <React.Fragment>
        <label htmlFor="response">Response</label>
        <input
          type={input}
          name="response"
          onChange={event =>
            dispatch(setResponse(item.key, event.target.value))
          }
          value={response}
          autoFocus
        />

        <textarea
          onChange={event => dispatch(setNote(item.key, event.target.value))}
          defaultValue={note}
          placeholder="Note"
        />
      </React.Fragment>
    </div>
  );
};

export const ResponseContainer = connect(state => state)(Response);
