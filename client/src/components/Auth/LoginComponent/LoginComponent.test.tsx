import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginComponent from './LoginComponent';

describe('<LoginComponent />', () => {
  test('it should mount', () => {
    render(<LoginComponent />);
    
    const loginComponent = screen.getByTestId('LoginComponent');

    expect(loginComponent).toBeInTheDocument();
  });
});