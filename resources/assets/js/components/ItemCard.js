import React from 'react';
import { Markdown } from './Markdown';

const Header = ({ item, isActive }) => (
  <b>
    {(item.input || item.scale) && (
      <div>
        <span>{item.key}</span>
      </div>
    )}
    <div>{item.title}</div>
  </b>
);

export const ItemCard = ({ isActive, index, item, dispatch, response }) => {
  const { key, description, help, validate, options } = item;
  let { input } = item;

  if (input === 'integer') {
    input = 'number';
  }
  if (input === 'string') {
    input = 'text';
  }

  if (!input) {
    return (
      <div>
        <Header item={item} isActive={isActive} />
        <Markdown source={description} />
        <Markdown source={help} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ flex: 3 }}>
        <Header item={item} isActive={isActive} />
        <Markdown source={description} />
        <Markdown source={help} />
      </div>
    </div>
  );
};
