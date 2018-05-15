import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { scanInfo, scanData } from '../data';
import { ItemList, ResponseContainer } from './Items';
import { items } from '../items/2.1/scan.2.1.items.da.json';

class Scan extends Component {
  render() {
    return (
      <div>
        <div style={{ display: 'flex' }}>
          <ItemList items={items} />
          <ResponseContainer items={items} />
        </div>
        <textarea
          placeholder="Save som JSON"
          defaultValue={JSON.stringify(scanData.data)}
        />
      </div>
    );
  }
}

export default connect(state => state)(Scan);
