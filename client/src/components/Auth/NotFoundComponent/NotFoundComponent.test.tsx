import '@testing-library/jest-dom/extend-expect';

import { render, screen } from '@testing-library/react';

import NotFoundComponent from './NotFoundComponent';
import { Provider } from 'react-redux';
import React from 'react';
import store from '../../Redux/store';

describe('<NotFoundComponent />', () => {
  test('it should mount', () => {
    render(
      <Provider store={store}>
        <NotFoundComponent />
      </Provider>
    );

    const notFoundComponent = screen.getByTestId('NotFoundComponent');

    expect(notFoundComponent).toBeInTheDocument();
  });
});
