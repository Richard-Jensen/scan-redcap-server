import React from 'react';
import { connect } from 'react-redux';
import { setActiveItem, setResponse, setNote } from '../actions';
import { List } from 'react-virtualized';
import { ItemCard } from './ItemCard';

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
      rowHeight={({ index }) => (items[index].input ? 40 : 50)}
      rowCount={items.length}
      overscanRowCount={10}
      rowRenderer={rowRenderer}
    />
  );
};

const Item = ({ item, dispatch, interview, style, key }) => {
  const isActive = item.key === interview.activeKey;

  return (
    <div style={style} key={key}>
      <button
        onClick={() => dispatch(setActiveItem(item.key))}
        style={{
          backgroundColor: isActive ? 'grey' : '',
          height: '100%',
          width: '100%',
          fontSize: '10px',
          textAlign: 'left'
        }}
      >
        <div>
          {item.key}
          <span>{item.title}</span>
        </div>
      </button>
    </div>
  );
};

const ItemContainer = connect(state => state)(Item);

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
      {input && (
        <input
          type={input}
          onChange={event =>
            dispatch(setResponse(item.key, event.target.value))
          }
          defaultValue={response}
          autoFocus
        />
      )}

      <textarea
        onChange={event => dispatch(setNote(item.key, event.target.value))}
        defaultValue={note}
        placeholder="Note"
      />
    </div>
  );
};

export const ResponseContainer = connect(state => state)(Response);
