import React, { Fragment } from 'react';
import Downshift from 'downshift';
import { List } from 'react-virtualized';
import { connect } from 'react-redux';
import { items } from '../items';
import { setActiveItem } from '../actions';
import classNames from 'classnames';

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

        return (
          <div className="search-portal">
            <input
              className="search-input"
              {...getInputProps({ placeholder: 'Find item...' })}
            />
            {isOpen ? (
              <Fragment>
                {foundItems.length ? (
                  <div className="search-results">
                    <List
                      style={{ outline: 'none' }}
                      scrollToIndex={highlightedIndex || 0}
                      height={
                        foundItems.length < 10 ? foundItems.length * 42 : 420
                      }
                      width={600}
                      rowHeight={42}
                      rowCount={foundItems.length}
                      overscanRowCount={5}
                      rowRenderer={({ index, style }) => {
                        const item = foundItems[index];
                        const isActive = highlightedIndex === index;
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
                            className={classNames('search-item', {
                              'search-item-active': isActive
                            })}
                          >
                            {item.key} {item.title}
                          </div>
                        );
                      }}
                    />
                  </div>
                ) : null}
              </Fragment>
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
