import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { scanData } from '../data';

export default class Scan extends Component {
  constructor(props) {
    super(props);
    this.textRef = React.createRef();
  }

  save = () => {
    axios
      .post(`/scan/${scanData.record_id}/save`, {
        data: this.textRef.current.value
      })
      .then(response => {
        console.log(response);
      });
  };

  render() {
    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>{scanData.initials}</h1>
        <textarea placeholder="Save som JSON" ref={this.textRef} />
        <button type="button" onClick={this.save}>
          Save
        </button>
      </div>
    );
  }
}

if (document.getElementById('scan-app')) {
  ReactDOM.render(<Scan />, document.getElementById('scan-app'));
}
