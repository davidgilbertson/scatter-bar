import * as storage from './storage';

export const getFromUrlOrLs = key => {
  const url = new URL(document.location);
  const item = url.searchParams.get(key);

  if (item) {
    // If there's an item in the URL, use it
    storage.setItem(key, item);

    return item;
  }

  // Else check local storage (maybe undefined)
  return storage.getItem(key);
};

export const getWithId = id => {
  const url = new URL(document.location);

  if (id) {
    url.searchParams.set(storage.KEYS.ID, id);
  } else {
    url.searchParams.delete(storage.KEYS.ID);
  }

  return url.href;
};
