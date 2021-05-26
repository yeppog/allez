import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProfileComponent from './ProfileComponent';

describe('<ProfileComponent />', () => {
  test('it should mount', () => {
    render(<ProfileComponent />);
    
    const profileComponent = screen.getByTestId('ProfileComponent');

    expect(profileComponent).toBeInTheDocument();
  });
});