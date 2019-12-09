export const KEYS = {
  APP_DATA: 'APP_DATA',
  ID: 'id',
};

export const setItem = (key, data) => {
  try {
    const string = JSON.stringify(data);
    window.localStorage.setItem(key, string);
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
};

export const getItem = (key) => {
  const storedItem = localStorage.getItem(key);

  try {
    // Try and parse JSON
    return JSON.parse(storedItem);
  } catch (err) {
    // It might just be a plain string or something, so return it, or nothing
    return storedItem || undefined;
  }
};

export const removeItem = id => window.localStorage.removeItem(id);
