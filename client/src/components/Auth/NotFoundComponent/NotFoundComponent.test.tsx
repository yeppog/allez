import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NotFoundComponent from './NotFoundComponent';

describe('<NotFoundComponent />', () => {
  test('it should mount', () => {
    render(<NotFoundComponent />);
    
    const notFoundComponent = screen.getByTestId('NotFoundComponent');

    expect(notFoundComponent).toBeInTheDocument();
  });
});