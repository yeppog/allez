import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RegisterComponent from './RegisterComponent';

describe('<RegisterComponent />', () => {
  test('it should mount', () => {
    render(<RegisterComponent />);
    
    const registerComponent = screen.getByTestId('RegisterComponent');

    expect(registerComponent).toBeInTheDocument();
  });
});