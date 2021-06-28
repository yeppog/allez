import '@testing-library/jest-dom/extend-expect';

import { render, screen } from '@testing-library/react';

import { Provider } from 'react-redux';
import React from 'react';
import ResetRequestComponent from './ResetRequestComponent';
import store from '../../Redux/store';

describe('<ResetRequestComponent />', () => {
  test('it should mount', () => {
    render(
      <Provider store={store}>
        <ResetRequestComponent />
      </Provider>
    );

    const resetRequestComponent = screen.getByTestId('ResetRequestComponent');

    expect(resetRequestComponent).toBeInTheDocument();
  });
});
