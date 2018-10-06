import React, { Component } from 'react';
import data from '../data/mock';
import styles from './App.module.css';
import Chart from '../Chart/Chart';

class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        <Chart {...data} />
      </div>
    );
  }
}

export default App;
