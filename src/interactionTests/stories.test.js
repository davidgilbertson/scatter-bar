import React from 'react';
import { fireEvent, render, waitFor, within } from '@testing-library/react';
import App from '../App/App';
import init from '../utils/init';

test('Stories', async () => {
  localStorage.clear();
  init();

  const {
    queryByTestId,
    getByText,
    getAllByText,
    getByTestId,
  } = render(<App/>);

  await waitFor(() => getAllByText('An example: 9% random variation'));
  
  // Stories > The current story name should be shown in the story drop down
  expect(getAllByText('An example: 9% random variation')).toHaveLength(3);

  // Stories > When "Add a new story" is selected from the story drop down, a new story is added
  const selectEl = getByTestId('story-selector');

  const newStoryOption = within(selectEl).getByText('Add a new story');
  fireEvent.change(selectEl, {target: {value: newStoryOption.value}});

  // Stories > Given a story with no sets, then only a data panel should be rendered
  expect(queryByTestId('Table')).toBeInTheDocument();
  expect(queryByTestId('Chart')).not.toBeInTheDocument();

  // Stories > Given a story with no sets, then an "Add a new set" button should be present
  expect(getByText('Add a new set')).toBeInTheDocument();
});
