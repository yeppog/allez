import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ResetRequestComponent from './ResetRequestComponent';

describe('<ResetRequestComponent />', () => {
  test('it should mount', () => {
    render(<ResetRequestComponent />);
    
    const resetRequestComponent = screen.getByTestId('ResetRequestComponent');

    expect(resetRequestComponent).toBeInTheDocument();
  });
});