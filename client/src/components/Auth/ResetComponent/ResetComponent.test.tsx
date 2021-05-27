import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ResetComponent from './ResetComponent';

describe('<ResetComponent />', () => {
  test('it should mount', () => {
    render(<ResetComponent />);
    
    const resetComponent = screen.getByTestId('ResetComponent');

    expect(resetComponent).toBeInTheDocument();
  });
});