import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CreatePostComponent from './CreatePostComponent';

describe('<CreatePostComponent />', () => {
  test('it should mount', () => {
    render(<CreatePostComponent />);
    
    const createPostComponent = screen.getByTestId('CreatePostComponent');

    expect(createPostComponent).toBeInTheDocument();
  });
});