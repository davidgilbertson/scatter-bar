import React from 'react';
import uuid from 'uuid/v4';
import { collect, store } from 'react-recollect';
import styles from './App.module.css';
import Chart from '../Chart/Chart';
import Table from '../Table/Table';
import mockData from '../data/mock';
import * as storage from '../utils/storage';
import * as log from '../utils/log';

// simulate asynchronous data loading
setTimeout(() => {
  log.time('Time to interactive');
  const data = storage.getItem(storage.KEYS.APP_DATA) || mockData;
  store.stories = data.stories;
  store.currentStoryIndex = data.currentStoryIndex || 0;
  store.status = 'ready';
}, 17);

const App = ({store}) => {
  if (store.status !== 'ready') return null;

  const currentStory = store.stories[store.currentStoryIndex];

  return (
    <React.Fragment>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Scatter bar playground
        </h1>

        <select
          className={styles.select}
          onChange={e => {
            if (e.target.value === 'NEW STORY') {
              const newStory = {
                id: uuid(),
                name: 'A new story',
                sets: [],
              };

              store.stories.push(newStory);
              store.currentStoryIndex = store.stories.length - 1;
            } else {
              store.currentStoryIndex = store.stories.findIndex(story => story.id === e.target.value);
            }

          }}
          value={currentStory.id}
        >
          {store.stories.map(story => (
            <option key={story.id} value={story.id}>
              {story.name}
            </option>
          ))}

          <option disabled>-----------</option>

          <option value="NEW STORY">Add a new story</option>
        </select>
      </header>

      <div className={styles.page}>
        <Table />

        <Chart />
      </div>
    </React.Fragment>
  );
};

export default collect(App);
