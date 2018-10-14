import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
} from 'react-testing-library';
import App from '../App/App';

afterAll(cleanup);

test('Storage > When a value is added, it should be remembered after the page is refreshed', () => {
  localStorage.clear();

  const {
    getByText,
    getByTestId,
  } = render(<App />);

  expect(getByText('Random set 1')).toBeInTheDocument();

  const listedValues = getByTestId('TableRow__values').textContent.split('✕');

  expect(listedValues).toEqual(expect.arrayContaining([
    '1,202',
    '4,686',
    '134',
    '3,220',
    '1,014',
    '2,494',
    '2,700',
    '1,253',
    '3,580',
    '2,655',
    '1,849',
    '2,893',
    '1,755',
    '3,202',
    '1,242',
    '4,298',
    '1,678',
    '4,478',
    '2,424',
    '3,895',
    '1,866',
    '2,494',
  ]));

  const form = getByTestId('TableRow__form');
  const input = form.querySelector('input');

  fireEvent.change(input, {
    target: {
      value: '9999',
    },
  });

  fireEvent.click(getByText('Add'));

  // Check it's going into localStorage
  const storedData = JSON.parse(localStorage.getItem('app-data'));
  const newSet = storedData.stories[0].sets[0];

  expect(newSet.data).toContain(9999);

  // Check it's still there after the page re-renders
  cleanup();

  const {
    getByTestId: secondGetByTestId,
  } = render(<App />);

  expect(secondGetByTestId('TableRow__values')).toHaveTextContent('9,999');

});
