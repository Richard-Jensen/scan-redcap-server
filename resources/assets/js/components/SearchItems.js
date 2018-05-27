import React from 'react';
import Downshift from 'downshift';
import { List } from 'react-virtualized';
import { connect } from 'react-redux';
import { items } from '../items';
import { setActiveItem } from '../actions';

const Autocomplete = ({ items, onChange }) => {
  return (
    <Downshift
      onChange={onChange}
      itemToString={item => (item ? item.title : item)}
    >
      {({
        getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        selectedItem,
        highlightedIndex
      }) => {
        let foundItems =
          inputValue &&
          items.filter(item => {
            return (
              (item.key &&
                item.key.toLowerCase().includes(inputValue.toLowerCase())) ||
              item.title.toLowerCase().includes(inputValue.toLowerCase()) ||
              (item.description &&
                item.description
                  .toLowerCase()
                  .includes(inputValue.toLowerCase()))
            );
          });
        if (foundItems === null) {
          foundItems = [];
        }

        return (
          <div className="search-portal">
            <input
              className="search-input"
              {...getInputProps({ placeholder: 'Find item...' })}
            />
            {isOpen ? (
              <div className="search-results">
                {foundItems.length ? (
                  <List
                    style={{ outline: 'none' }}
                    scrollToIndex={highlightedIndex || 0}
                    height={400}
                    width={600}
                    rowHeight={42}
                    rowCount={foundItems.length}
                    overscanRowCount={5}
                    rowRenderer={({ index, style }) => {
                      const item = foundItems[index];
                      return (
                        <div
                          key={index}
                          {...getItemProps({
                            item,
                            index,
                            style: {
                              ...style
                            }
                          })}
                          className="search-item"
                        >
                          {item.key} {item.title}
                        </div>
                      );
                    }}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        );
      }}
    </Downshift>
  );
};

const Search = ({ dispatch }) => {
  return (
    <Autocomplete
      items={items}
      onChange={selectedItem => {
        dispatch(setActiveItem({ key: selectedItem.key }));
      }}
    />
  );
};

export const SearchItems = connect(state => state)(Search);
