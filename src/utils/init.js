import throttle from 'lodash.throttle';
import { afterChange, store } from 'react-recollect';
import api from '../data/api';
import * as storage from './storage';
import * as log from './log';
import mockData from '../data/mock';
import * as urlUtils from './urlUtils';

const throttledApiUpdate = throttle(api.update, 2000);

const loadLocalData = () => {
  // To transition, take data from local storage if there is any
  // (new version don't bother)
  const data = storage.getItem(storage.KEYS.APP_DATA) || mockData;
  store.stories = data.stories;
  store.currentStoryIndex = data.currentStoryIndex || 0;
  store.status = 'ready';

  return data;
};

const createNewData = async () => {
  // Put some mock data on the screen
  const localData = loadLocalData();

  // And also save that data back to the database
  const response = await api.create(localData);

  if (response.error) {
    // At this point we're toast. Do nothing. It's going to retry on change anyway
    console.error('Error creating a new record:', response.error);
  } else {
    // Data is saved, it's already in the store so we just need to store the id too
    store.id = response.id;

    storage.setItem(storage.KEYS.ID, response.id);
  }
};

const loadData = async id => {
  const response = await api.read(id);

  if (response.error) {
    // Oh no! No data.
    console.error('Error fetching data:', response.error);

    // This must be a bad ID. Wipe all traces of it
    wipeId();

    // And start from scratch
    await createNewData();
  } else if ('stories' in response && 'currentStoryIndex' in response) {
    // Good, we got some data. Let's put it in the store.
    store.id = id;
    store.stories = response.stories;
    store.currentStoryIndex = response.currentStoryIndex || 0;
    store.status = 'ready';
  } else {
    // How odd, the data returned didn't have stories and currentStoryIndex props!
    console.warn('The data returned was poorly formed');

    // Start from scratch
    await createNewData();
  }
};

const wipeId = () => {
  storage.removeItem(storage.KEYS.ID);

  window.history.replaceState({}, '', urlUtils.getWithId());
};

const init = async () => {
  log.time('Time to interactive');

  const id = urlUtils.getFromUrlOrLs(storage.KEYS.ID);

  if (!id) {
    // You must be new here, let's create some data
    await createNewData();
  } else {
    // // Ah good, there's an ID. Let's fetch the data for it.
    await loadData(id);
  }

  // Now the initial load is done, we can start listening for changes
  afterChange(({store}) => {
    const data = {
      stories: store.stories,
      currentStoryIndex: store.currentStoryIndex,
    };

    storage.setItem(storage.KEYS.APP_DATA, data);

    const currentId = storage.getItem(storage.KEYS.ID);
    if (!currentId) {
      console.warn('It is odd that there is no ID');
    } else {
      // update the store, but not too often
      throttledApiUpdate(currentId, data);
    }
  });
};

export default init;
