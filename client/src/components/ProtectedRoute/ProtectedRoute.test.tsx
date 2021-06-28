import '@testing-library/jest-dom/extend-expect';

import { render, screen } from '@testing-library/react';

import ProtectedRoute from './ProtectedRoute';
import { Provider } from 'react-redux';
import React from 'react';
import store from '../Redux/store';

describe('<ProtectedRoute />', () => {
  test('it should mount', () => {
    render(
      <Provider store={store}>
        <ProtectedRoute authenticationPath="test" />
      </Provider>
    );

    const protectedRoute = screen.getByTestId('ProtectedRoute');

    expect(protectedRoute).toBeInTheDocument();
  });
});
