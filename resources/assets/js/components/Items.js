import React from 'react';
import { connect } from 'react-redux';
import { setActiveItem, setResponse } from '../actions';
import { List } from 'react-virtualized';

export const ItemList = ({ items }) => {
  const rowRenderer = ({ index, isScrolling, key, style }) => {
    const item = items[index];
    return <ItemContainer key={item.key} item={item} style={style} key={key} />;
    const { title, key: itemKey, input } = items[index];
    return (
      <div key={key} style={style}>
        <div tabIndex="0">
          <div>
            {input && <div>{itemKey}</div>}
            <div>{title}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <List
      style={{ outline: 'none' }}
      height={400}
      width={200}
      rowHeight={({ index }) => (items[index].input ? 90 : 40)}
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
  let input = item.input;
  if (input === 'integer') {
    input = 'number';
  }

  return (
    <div
      onClick={() => dispatch(setActiveItem(item.key))}
      style={style}
      key={key}
    >
      <button onClick={() => dispatch(setActiveItem(item.key))}>
        {isActive ? <b>{item.key}</b> : item.key}
      </button>
    </div>
  );
};

const ItemContainer = connect(state => state)(Item);

const Response = ({ items, dispatch, interview }) => {
  const item = items.find(item => item.key === interview.activeKey);
  return (
    <div key={item.key}>
      <h4>{item.key}</h4>
      <input
        type={item.input}
        onChange={event => dispatch(setResponse(item.key, event.target.value))}
        value={interview.responses[item.key] || ''}
      />
    </div>
  );
};

export const ResponseContainer = connect(state => state)(Response);
