import '@testing-library/jest-dom/extend-expect';

import { render, screen } from '@testing-library/react';

import { Provider } from 'react-redux';
import React from 'react';
import ResetComponent from './ResetComponent';
import store from '../../Redux/store';

describe('<ResetComponent />', () => {
  test('it should mount', () => {
    render(
      <Provider store={store}>
        <ResetComponent />
      </Provider>
    );

    const resetComponent = screen.getByTestId('ResetComponent');

    expect(resetComponent).toBeInTheDocument();
  });
});
