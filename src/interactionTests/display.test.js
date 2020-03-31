import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import App from '../App/App';
import init from '../utils/init';

test('Display', async () => {
  init();
  
  const {
    container,
    getByTestId,
    getByText,
    queryByTestId,
    getAllByText,
  } = render(<App/>);

  // Stories > Given a story with some sets, then a data panel and chart should be rendered'
  await waitFor(() => getAllByText('An example: 9% random variation'));

  expect(getByTestId('Table')).toBeInTheDocument();
  expect(getByTestId('Chart')).toBeInTheDocument();
  expect(getAllByText('Random set 1')).toHaveLength(2);
  expect(getAllByText('Random set 2')).toHaveLength(2);
  expect(queryByTestId('cats')).not.toBeInTheDocument();

  // Sets > When "Add a new set" is clicked, a new set is added
  const addScenarioButton = getByText('Add a new set');
  fireEvent.click(addScenarioButton);
  expect(getAllByText('A new set')).toHaveLength(2);

  // Sets > When a set name is clicked, a new set name can be typed
  const newSet = getAllByText('A new set')[0];

  expect(queryByTestId('EditableText__test-area')).not.toBeInTheDocument();

  fireEvent.click(newSet);

  await waitFor(() => {}); // after the click, events are bound on the next tick

  expect(queryByTestId('EditableText__test-area')).toBeInTheDocument();

  const newSetTextarea = getAllByText('A new set')[0];

  fireEvent.change(newSetTextarea, {
    target: {
      value: 'The new name of the thing',
    },
  });

  expect(getAllByText('The new name of the thing')).toHaveLength(2);

  fireEvent.keyPress(newSetTextarea, {
    key: 'Escape',
  });

  fireEvent.click(container);

  await waitFor(() => {
    expect(queryByTestId('EditableText__test-area')).not.toBeInTheDocument();
  });
});
