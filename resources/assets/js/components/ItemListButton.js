import React from 'react';
import { connect } from 'react-redux';
import { setActiveItem } from '../actions';
import classNames from 'classnames';

const ItemButton = ({ item, dispatch, interview, style, key }) => {
  const isActive = item.key === interview.activeKey;
  let isDisabled = false;
  let hasResponse = interview.responses[item.key] ? true : false;

  if (interview.disabledItems) {
    const disabledItems = interview.disabledItems;
    isDisabled = disabledItems.includes(item.key);
  }

  return (
    <div
      style={style}
      key={key}
      onClick={() => dispatch(setActiveItem({ key: item.key }))}
    >
      <div
        className={classNames('list-item', {
          'list-item-active': isActive,
          'list-item-is-disabled': isDisabled,
          'list-item-has-response': hasResponse
        })}
      >
        {(item.input || item.scale) && (
          <div className="list-item-key">{item.key}</div>
        )}
        <div className="list-item-title">{item.title}</div>
      </div>
    </div>
  );
};

export const ItemListButton = connect(state => state)(ItemButton);
