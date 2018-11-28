import React from 'react';
import { connect } from 'react-redux';
import { flipSetting } from '../actions';
import { Switch } from './Switch';


// Old component using dropdown
// const SettingsViewOld = ({ dispatch, settings }) => {
//   return (
//     <div className="scan-app-settings">
//       <div className="scan-app-settings-label">Settings</div>
//       <div className="scan-app-settings-dropdown">
//         <div className="scan-app-settings-item">
//           <Switch
//             labelOn="Show Glossary"
//             onChange={() => dispatch(flipSetting({ setting: 'showGlossary' }))}
//             checked={settings.showGlossary}
//           />
//         </div>
//         <div className="scan-app-settings-item">
//           <Switch
//             labelOn="Show Item Notes"
//             onChange={() => dispatch(flipSetting({ setting: 'showItemNotes' }))}
//             checked={settings.showItemNotes}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

const SettingsView = ({ dispatch, settings }) => {
  return (
      <div className="scan-app-switches">
        <div className="scan-app-settings-item">
          <Switch
            labelOn="Show Glossary"
            onChange={() => dispatch(flipSetting({ setting: 'showGlossary' }))}
            checked={settings.showGlossary}
          />
        </div>
        <div className="scan-app-settings-item">
          <Switch
            labelOn="Show Item Notes"
            onChange={() => dispatch(flipSetting({ setting: 'showItemNotes' }))}
            checked={settings.showItemNotes}
          />
        </div>
        <div className="scan-app-settings-item">
          <Switch
            labelOn="Show Analysis"
            onChange={() => dispatch(flipSetting({ setting: 'showAnalysis' }))}
            checked={settings.showAnalysis}
          />
        </div>
      </div>
  );
};

export const Settings = connect(state => state)(SettingsView);
