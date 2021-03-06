import React from 'react';
import { v4 as uuid } from 'uuid';
import { collect } from 'react-recollect';
import styles from './App.module.css';
import Chart from '../Chart/Chart';
import Table from '../Table/Table';
import * as utlUtils from '../utils/urlUtils';
import * as shareApi from '../utils/shareApi';
import { KEYS } from '../utils/storage';

const App = ({store}) => {
  if (store.status !== 'ready') return null;
  const currentStory = store.stories[store.currentStoryIndex];

  const urlHasId = !!(new URL(document.location)).searchParams.get(KEYS.ID);

  return (
    <React.StrictMode>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Scatter Bar
        </h1>

        <select
          className={styles.select}
          data-testid="story-selector"
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

        <button className={styles.share} onClick={shareApi.share}>
          {shareApi.canShare() ? 'Share' : 'Tweet'}
        </button>
      </header>

      {!urlHasId && (
        <a
          className={styles.permalink}
          href={utlUtils.getWithId(store.id)}
          title="You can load this URL anywhere
          and it will load the data you have entered into Scatter Bar.
          Anyone with the URL will be able to see and edit your data."
        >Get a unique URL to your data. <br/> Don't share it!</a>
      )}

      <div className={styles.page}>
        <Table />

        <Chart />
      </div>
    </React.StrictMode>
  );
};

export default collect(App);
