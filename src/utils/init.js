import throttle from 'lodash.throttle';
import { afterChange, store, initStore, batch } from 'react-recollect';
import cab from '../data/cab';
import * as storage from './storage';
import * as log from './log';
import mockData from '../data/mock';
import * as urlUtils from './urlUtils';

const throttledUpdate = throttle(cab.update, 2000);

initStore({
  id: null,
  stories: [],
  currentStoryIndex: 0,
  status: null,
});

const loadLocalData = () => {
  // To transition, take data from local storage if there is any
  // (new version don't bother)
  const data = storage.getItem(storage.KEYS.APP_DATA) || mockData;
  batch(() => {
    store.stories = data.stories;
    store.currentStoryIndex = data.currentStoryIndex || 0;
    store.status = 'ready';
  });

  return data;
};

const createNewData = async () => {
  // Put some mock data on the screen
  const localData = loadLocalData();

  // And also save that data back to the database
  const {error, id} = await cab.create(localData);

  if (error) {
    // At this point we're toast. Do nothing. It's going to retry on change anyway
    console.error('Error creating a new record:', error);
  } else {
    // Data is saved, it's already in the store so we just need to store the id too
    store.id = id;

    storage.setItem(storage.KEYS.ID, id);
  }
};

const loadData = async id => {
  const {error, data} = await cab.read(id);

  if (error) {
    // Oh no! No data.
    console.error('Error fetching data:', error);

    // This must be a bad ID. Wipe all traces of it
    wipeId();

    // And start from scratch
    await createNewData();
  } else if ('stories' in data && 'currentStoryIndex' in data) {
    // Good, we got some data. Let's put it in the store.
    batch(() => {
      store.id = id;
      store.stories = data.stories;
      store.currentStoryIndex = data.currentStoryIndex || 0;
      store.status = 'ready';
    });
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

/** @returns void */
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
  afterChange(e => {
    const data = {
      stories: e.store.stories,
      currentStoryIndex: e.store.currentStoryIndex,
    };

    storage.setItem(storage.KEYS.APP_DATA, data);

    const currentId = storage.getItem(storage.KEYS.ID);
    if (!currentId) {
      console.warn('It is odd that there is no ID');
    } else {
      // update the store, but not too often
      throttledUpdate(currentId, data);
    }
  });
};

export default init;
