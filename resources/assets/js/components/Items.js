import React from 'react';
import { connect } from 'react-redux';
import { setActiveItem, setResponse } from '../actions';

export const Items = ({ items }) => (
  <ul>
    {items.map(item => {
      return <ItemContainer key={item.key} item={item} />;
    })}
  </ul>
);

const Item = ({ item, dispatch, interview }) => {
  const isActive = item.key === interview.activeKey;
  return (
    <li onClick={() => dispatch(setActiveItem(item.key))}>
      <div>{isActive ? <b>{item.key}</b> : item.key}</div>
      {isActive && (
        <input
          type={item.input}
          onChange={event =>
            dispatch(setResponse(item.key, event.target.value))
          }
          value={interview.responses[item.key]}
        />
      )}
    </li>
  );
};

const ItemContainer = connect(state => state)(Item);
