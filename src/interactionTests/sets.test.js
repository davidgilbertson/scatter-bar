import React from 'react';
import { render, waitFor, within } from '@testing-library/react';
import App from '../App/App';
import init from '../utils/init';

test('Display', async () => {
  localStorage.clear();
  init();

  const {
    getByTestId,
  } = render(<App />);

  // Sets > Given a story with two sets, then two sets should be rendered
  await waitFor(() => getByTestId('Table'));
  
  const table = getByTestId('Table');
  expect(within(table).getByText('Random set 1')).toBeInTheDocument();
  expect(within(table).getByText('Random set 2')).toBeInTheDocument();
});
