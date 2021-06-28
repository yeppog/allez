import '@testing-library/jest-dom/extend-expect';

import { render, screen } from '@testing-library/react';

import ProfileSettingsComponent from './ProfileSettingsComponent';
import { Provider } from 'react-redux';
import React from 'react';
import store from '../Redux/store';

describe('<ProfileSettingsComponent />', () => {
  test('it should mount', () => {
    render(
      <Provider store={store}>
        <ProfileSettingsComponent />
      </Provider>
    );

    const profileSettingsComponent = screen.getByTestId(
      'ProfileSettingsComponent'
    );

    expect(profileSettingsComponent).toBeInTheDocument();
  });
});
