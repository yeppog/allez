import '@testing-library/jest-dom/extend-expect';

import { render, screen } from '@testing-library/react';

import CreatePostComponent from './CreatePostComponent';
import { Provider } from 'react-redux';
import React from 'react';
import store from '../Redux/store';

describe('<CreatePostComponent />', () => {
  test('it should mount', () => {
    render(
      <Provider store={store}>
        <CreatePostComponent />
      </Provider>
    );

    const createPostComponent = screen.getByTestId('CreatePostComponent');

    expect(createPostComponent).toBeInTheDocument();
  });
});
