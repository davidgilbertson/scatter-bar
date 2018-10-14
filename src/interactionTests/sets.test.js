import React from 'react';
import {
  render,
  cleanup,
  within,
} from 'react-testing-library';
import App from '../App/App';

describe('Display', () => {
  cleanup();
  localStorage.clear();

  const {
    getByTestId,
  } = render(<App />);

  it('Sets > Given a story with two sets, then two sets should be rendered', () => {
    const table = getByTestId('Table');
    expect(within(table).getByText('Random set 1')).toBeInTheDocument();
    expect(within(table).getByText('Random set 2')).toBeInTheDocument();
  });
});
