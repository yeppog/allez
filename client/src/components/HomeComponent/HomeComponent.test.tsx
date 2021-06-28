import '@testing-library/jest-dom/extend-expect';

import { render, screen } from '@testing-library/react';

import HomeComponent from './HomeComponent';
import { Provider } from 'react-redux';
import React from 'react';
import store from '../Redux/store';

describe('<HomeComponent />', () => {
  test('it should mount', () => {
    render(
      <Provider store={store}>
        <HomeComponent />
      </Provider>
    );

    const homeComponent = screen.getByTestId('HomeComponent');

    expect(homeComponent).toBeInTheDocument();
  });
});
