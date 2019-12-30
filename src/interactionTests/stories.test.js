import React from 'react';
import {
  render,
  within,
  fireEvent,
  cleanup,
  wait,
} from 'react-testing-library';
import App from '../App/App';

describe('Stories', () => {
  cleanup();
  localStorage.clear();

  const {
    queryByTestId,
    getByText,
    getBySelectText,
  } = render(<App />);


  test('Stories > The current story name should be shown in the story drop down', async () => {
    await wait(() => getByText('An example: 9% random variation'));
    expect(getBySelectText('An example: 9% random variation')).toBeInTheDocument();
  });

  test('Stories > When "Add a new story" is selected from the story drop down, a new story is added', async () => {
    await wait(() => getByText('An example: 9% random variation'));
    const selectEl = getBySelectText('An example: 9% random variation');

    const newStoryOption = within(selectEl).getByText('Add a new story');
    fireEvent.change(selectEl, { target: { value: newStoryOption.value } });

    expect(getBySelectText('A new story')).toBeInTheDocument();
  });

  test('Stories > Given a story with no sets, then only a data panel should be rendered', async () => {
    await wait(() => getByText('An example: 9% random variation'));

    expect(queryByTestId('Table')).toBeInTheDocument();
    expect(queryByTestId('Chart')).not.toBeInTheDocument();
  });

  test('Stories > Given a story with no sets, then an "Add a new set" button should be present', async () => {
    await wait(() => getByText('An example: 9% random variation'));

    expect(getByText('Add a new set')).toBeInTheDocument();
  });
});
