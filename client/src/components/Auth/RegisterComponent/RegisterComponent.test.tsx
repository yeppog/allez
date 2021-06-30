import '@testing-library/jest-dom/extend-expect';

import { render, screen } from '@testing-library/react';

import { Provider } from 'react-redux';
import React from 'react';
import RegisterComponent from './RegisterComponent';
import store from '../../Redux/store';

describe('<RegisterComponent />', () => {
  test('it should mount', () => {
    render(
      <Provider store={store}>
        <RegisterComponent />
      </Provider>
    );

    const registerComponent = screen.getByTestId('RegisterComponent');

    expect(registerComponent).toBeInTheDocument();
  });
});
