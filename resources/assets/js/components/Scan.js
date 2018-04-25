import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Scan extends Component {
  render() {
    return <h1 style={{ textAlign: 'center' }}>Scan</h1>;
  }
}

if (document.getElementById('scan-app')) {
  ReactDOM.render(<Scan />, document.getElementById('scan-app'));
}
