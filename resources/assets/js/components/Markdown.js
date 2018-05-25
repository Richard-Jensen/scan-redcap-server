import React from 'react';
import Remarkable from 'remarkable';

const md = new Remarkable();

export const Markdown = ({ source }) => {
  const renderedMarkdown = md.render(source);
  const markdownWithLinks = renderedMarkdown.replace(
    /(\[)(\d{1,2}\.\d+\w*)(\])/g,
    (match, p1, p2) => {
      return `<a data-item="${p2}">${p2}</a>`;
    }
  );
  return source ? (
    <div dangerouslySetInnerHTML={{ __html: markdownWithLinks }} />
  ) : null;
};
