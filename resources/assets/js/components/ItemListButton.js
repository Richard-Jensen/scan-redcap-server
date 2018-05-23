import React from 'react';
import { connect } from 'react-redux';
import { setActiveItem } from '../actions';
import classNames from 'classnames';

const ItemButton = ({ item, dispatch, interview, style, key }) => {
  const isActive = item.key === interview.activeKey;

  return (
    <div
      style={style}
      key={key}
      onClick={() => dispatch(setActiveItem(item.key))}
    >
      <div
        className={classNames('list-item', { 'list-item-active': isActive })}
      >
        <div className="list-item-key">{item.key}</div>
        <div className="list-item-title">{item.title}</div>
      </div>
    </div>
  );
};

export const ItemListButton = connect(state => state)(ItemButton);
