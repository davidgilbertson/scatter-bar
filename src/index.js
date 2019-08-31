import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App/App';
import registerServiceWorker from './registerServiceWorker';
import * as log from './utils/log';
import init from './utils/init';

init();

log.time('JS parsed');

ReactDOM.render(<App />, document.getElementById('root'));

log.time('App rendered');

registerServiceWorker();
