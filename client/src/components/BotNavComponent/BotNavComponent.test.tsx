import '@testing-library/jest-dom/extend-expect';

import { render, screen } from '@testing-library/react';

import BotNavComponent from './BotNavComponent';
import { Provider } from 'react-redux';
import React from 'react';
import store from '../Redux/store';

describe('<BotNavComponent />', () => {
  test('it should mount', () => {
    render(
      <Provider store={store}>
        <BotNavComponent />
      </Provider>
    );

    const botNavComponent = screen.getByTestId('BotNavComponent');

    expect(botNavComponent).toBeInTheDocument();
  });
});
