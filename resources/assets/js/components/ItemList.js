import React from 'react';
import { ItemListButton } from './ItemListButton';
import { AutoSizer, List } from 'react-virtualized';

export const ItemList = ({ items, activeIndex }) => {
  const rowRenderer = ({ index, isScrolling, key, style }) => {
    const item = items[index];
    return (
      <ItemListButton key={item.key} item={item} style={style} key={key} />
    );
  };

  return (
    <AutoSizer>
      {({ width, height }) => (
        <List
          style={{ outline: 'none' }}
          scrollToIndex={activeIndex}
          scrollToAlignment={'center'}
          height={height}
          width={width}
          rowHeight={50}
          rowCount={items.length}
          overscanRowCount={10}
          rowRenderer={rowRenderer}
        />
      )}
    </AutoSizer>
  );
};
