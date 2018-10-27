export const KEYS = {
  APP_DATA: 'APP_DATA',
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
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (err) {
    console.error('Error reading from localStorage:', err);
    return null;
  }
};
