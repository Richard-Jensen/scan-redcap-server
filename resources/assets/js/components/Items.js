import React from 'react';
import { connect } from 'react-redux';
import { setActiveItem, setResponse, setComment } from '../actions';
import { List } from 'react-virtualized';

export const ItemList = ({ items, activeIndex }) => {
  const rowRenderer = ({ index, isScrolling, key, style }) => {
    const item = items[index];
    return <ItemContainer key={item.key} item={item} style={style} key={key} />;
  };

  return (
    <List
      style={{ outline: 'none' }}
      scrollToIndex={activeIndex}
      height={400}
      width={200}
      rowHeight={({ index }) => (items[index].input ? 40 : 20)}
      rowCount={items.length}
      overscanRowCount={10}
      rowRenderer={rowRenderer}
    />
  );
};

export const Items = ({ items }) => (
  <ul>
    {items.map(item => {
      return <ItemContainer key={item.key} item={item} />;
    })}
  </ul>
);

const Item = ({ item, dispatch, interview, style, key }) => {
  const isActive = item.key === interview.activeKey;

  return (
    <div
      onClick={() => dispatch(setActiveItem(item.key))}
      style={style}
      key={key}
    >
      <button
        onClick={() => dispatch(setActiveItem(item.key))}
        style={{ backgroundColor: isActive ? 'grey' : '' }}
      >
        {item.key}
      </button>
    </div>
  );
};

const ItemContainer = connect(state => state)(Item);

const Response = ({ items, dispatch, interview }) => {
  const item = items.find(item => item.key === interview.activeKey);
  let input = item.input;
  if (input === 'integer') {
    input = 'number';
  }
  if (input === 'string') {
    input = 'text';
  }
  const response = (interview.responses && interview.responses[item.key]) || '';
  const comment = (interview.comments && interview.comments[item.key]) || '';

  return (
    <div key={item.key}>
      <h4>{item.key}</h4>
      {item.description}
      <input
        type={input}
        onChange={event => dispatch(setResponse(item.key, event.target.value))}
        defaultValue={response}
        autoFocus
      />

      <textarea
        onChange={event => dispatch(setComment(item.key, event.target.value))}
        defaultValue={comment}
        placeholder="Comment"
      />
    </div>
  );
};

export const ResponseContainer = connect(state => state)(Response);
