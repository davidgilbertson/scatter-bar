import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  wait,
} from 'react-testing-library';
import App from '../App/App';

describe('Display', () => {
  afterAll(cleanup);

  const {
    getByText,
    queryByTestId,
    getByTestId,
    container,
  } = render(<App />);

  it('Display > Given a story with sets, then a data panel and chart should be rendered', () => {
    const title = getByText('An example: 9% random variation');

    expect(title).not.toBe(null);
    expect(getByTestId('Table')).toBeInTheDocument();
    expect(getByTestId('Chart')).toBeInTheDocument();
    expect(getByText('Random set 1')).toBeInTheDocument();
    expect(getByText('Random set 2')).toBeInTheDocument();
    expect(queryByTestId('cats')).not.toBeInTheDocument();
  });

  test('Display > Sets > Given "Add a new scenario" is clicked, a new scenario is added', () => {
    const addScenarioButton = getByText('Add a new scenario');
    fireEvent.click(addScenarioButton);
    expect(getByText('A new scenario')).toBeInTheDocument();
  });

  test('Display > Sets > Given a set name is clicked, a new scenario name can be typed', async () => {
    const newSet = getByText('A new scenario');

    expect(queryByTestId('EditableText__test-area')).not.toBeInTheDocument();

    fireEvent.click(newSet);

    await wait(); // after the click, events are bound on the next tick

    expect(queryByTestId('EditableText__test-area')).toBeInTheDocument();

    const newSetTextarea = getByText('A new scenario');

    fireEvent.change(newSetTextarea, {
      target: {
        value: 'The new name of the thing',
      },
    });

    expect(getByText('The new name of the thing')).toBeInTheDocument();

    fireEvent.keyPress(newSetTextarea, {
      key: 'Escape',
    });

    fireEvent.click(container);

    await wait(() => {
      expect(queryByTestId('EditableText__test-area')).not.toBeInTheDocument();
    });
  });
});
