import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EditPostModal from './EditPostModal';

describe('<EditPostModal />', () => {
  test('it should mount', () => {
    render(<EditPostModal />);
    
    const editPostModal = screen.getByTestId('EditPostModal');

    expect(editPostModal).toBeInTheDocument();
  });
});