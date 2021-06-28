import { render, screen } from '@testing-library/react';

import App from './App';
import { Provider } from 'react-redux';
import React from 'react';
import store from './components/Redux/store';

test('renders learn react link', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
