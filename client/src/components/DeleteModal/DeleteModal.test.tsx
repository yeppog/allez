import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DeleteModal from './DeleteModal';

describe('<DeleteModal />', () => {
  test('it should mount', () => {
    render(<DeleteModal />);
    
    const deleteModal = screen.getByTestId('DeleteModal');

    expect(deleteModal).toBeInTheDocument();
  });
});