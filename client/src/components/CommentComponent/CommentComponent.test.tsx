import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CommentComponent from './CommentComponent';

describe('<CommentComponent />', () => {
  test('it should mount', () => {
    render(<CommentComponent />);
    
    const commentComponent = screen.getByTestId('CommentComponent');

    expect(commentComponent).toBeInTheDocument();
  });
});