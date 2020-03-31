import '@testing-library/jest-dom/extend-expect';

window.console.info = () => {};

window.fetch = () => Promise.resolve({
  json: () => Promise.resolve({})
});
