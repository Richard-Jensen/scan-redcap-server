import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { scanInfo, scanData } from '../data';
import { items } from '../items';
import { Items } from './Items';

class Scan extends Component {
  render() {
    return (
      <div>
        <h3 style={{ textAlign: 'center' }}>{scanInfo.initials}</h3>
        <Items items={items} />

        <textarea
          placeholder="Save som JSON"
          defaultValue={JSON.stringify(scanData.data)}
        />
      </div>
    );
  }
}

export default connect(state => state)(Scan);
