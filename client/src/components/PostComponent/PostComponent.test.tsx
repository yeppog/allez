import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PostComponent from './PostComponent';

describe('<PostComponent />', () => {
  test('it should mount', () => {
    render(<PostComponent />);
    
    const postComponent = screen.getByTestId('PostComponent');

    expect(postComponent).toBeInTheDocument();
  });
});