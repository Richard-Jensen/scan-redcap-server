import React from 'react';
import { connect } from 'react-redux';
import { flipSetting } from '../actions';

const SettingsView = ({ dispatch, settings }) => {
  return (
    <div>
      <label>
        <input
          type="checkbox"
          name="showGlossary"
          checked={settings.showGlossary}
          onChange={() => {
            dispatch(flipSetting({ setting: 'showGlossary' }));
          }}
        />
        Show Glossary
      </label>
    </div>
  );
};

export const Settings = connect(state => state)(SettingsView);
