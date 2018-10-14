import React from 'react';
import {
  render,
  within,
  fireEvent,
  cleanup,
} from 'react-testing-library';
import App from '../App/App';

describe('Stories', () => {
  cleanup();

  const {
    queryByTestId,
    getBySelectText,
  } = render(<App />);

  test('Adding data > Stories > When "Add a new story" is selected from the story drop down, a new story is added', () => {
    const selectEl = getBySelectText('An example: 9% random variation');

    const newStoryOption = within(selectEl).getByText('Add a new story');
    fireEvent.change(selectEl, { target: { value: newStoryOption.value } });

    expect(getBySelectText('A new story')).toBeInTheDocument();
  });

  test('Display > Given a story with no sets, then only a data panel should be rendered', () => {
    expect(queryByTestId('Table')).toBeInTheDocument();
    expect(queryByTestId('Chart')).not.toBeInTheDocument();
  });

  test('Display > Given a story with no data, an "add set" button should be present', () => {
    expect(queryByTestId('Table')).toBeInTheDocument();
    expect(queryByTestId('Chart')).not.toBeInTheDocument();
  });
});
