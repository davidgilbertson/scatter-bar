import React from 'react';
import ReactDOM from 'react-dom';
import { afterChange } from 'react-recollect';
import './index.css';
import App from './App/App';
import registerServiceWorker from './registerServiceWorker';
import * as storage from './utils/storage';
import * as log from './utils/log';

log.time('JS parsed');
ReactDOM.render(<App />, document.getElementById('root'));
log.time('App rendered');

registerServiceWorker();

afterChange(store => {
  storage.setItem(storage.KEYS.APP_DATA, {
    stories: store.stories,
    currentStoryIndex: store.currentStoryIndex,
  });
});
