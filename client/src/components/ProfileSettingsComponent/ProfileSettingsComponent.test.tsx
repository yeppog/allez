import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProfileSettingsComponent from './ProfileSettingsComponent';

describe('<ProfileSettingsComponent />', () => {
  test('it should mount', () => {
    render(<ProfileSettingsComponent />);
    
    const profileSettingsComponent = screen.getByTestId('ProfileSettingsComponent');

    expect(profileSettingsComponent).toBeInTheDocument();
  });
});