import React, { Component } from 'react';
import uuid from 'uuid/v4';
import { collect, store } from 'react-recollect';
import styles from './App.module.css';
import Chart from '../Chart/Chart';
import Table from '../Table/Table';
import mockData from '../data/mock';
import * as storage from '../utils/storage';
import findById from '../utils/findById';

// simulate asynchronous data loading
setTimeout(() => {
  const data = storage.getItem(storage.KEYS.APP_DATA) || mockData;
  store.stories = data.stories;
  // Note, we don't load the currentStory directly from LS because we want it to be
  // a reference to the actual story object
  store.currentStory = data.stories.find(story => story.id === data.currentStoryId);
}, 100);

class App extends Component {
  render() {
    if (!store.stories || !store.currentStory) return null;

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

                store.currentStory = newStory;

                store.stories.push(newStory);
              } else {
                store.currentStory = findById(store.stories, e.target.value);
              }

            }}
            value={store.currentStory.id}
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
  }
}

export default collect(App);
