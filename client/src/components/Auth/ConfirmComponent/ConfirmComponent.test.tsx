import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ConfirmComponent from './ConfirmComponent';

describe('<ConfirmComponent />', () => {
  test('it should mount', () => {
    render(<ConfirmComponent />);
    
    const confirmComponent = screen.getByTestId('ConfirmComponent');

    expect(confirmComponent).toBeInTheDocument();
  });
});