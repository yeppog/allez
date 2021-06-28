import '@testing-library/jest-dom/extend-expect';

import { render, screen } from '@testing-library/react';

import DeleteModal from './DeleteModal';
import { Provider } from 'react-redux';
import React from 'react';
import store from '../Redux/store';

describe('<DeleteModal />', () => {
  test('it should mount', () => {
    render(
      <Provider store={store}>
        <DeleteModal />
      </Provider>
    );

    const deleteModal = screen.getByTestId('DeleteModal');

    expect(deleteModal).toBeInTheDocument();
  });
});
