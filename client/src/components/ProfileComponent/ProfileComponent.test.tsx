import '@testing-library/jest-dom/extend-expect';

import { render, screen } from '@testing-library/react';

import ProfileComponent from './ProfileComponent';
import { Provider } from 'react-redux';
import React from 'react';
import store from '../Redux/store';

describe('<ProfileComponent />', () => {
  test('it should mount', () => {
    render(
      <Provider store={store}>
        <ProfileComponent />
      </Provider>
    );

    const profileComponent = screen.getByTestId('ProfileComponent');

    expect(profileComponent).toBeInTheDocument();
  });
});
