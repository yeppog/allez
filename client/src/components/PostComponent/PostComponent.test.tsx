import '@testing-library/jest-dom/extend-expect';

import { render, screen } from '@testing-library/react';

import PostComponent from './PostComponent';
import { Provider } from 'react-redux';
import React from 'react';
import store from '../Redux/store';

describe('<PostComponent />', () => {
  test('it should mount', () => {
    render(
      <Provider store={store}>
        <PostComponent />
      </Provider>
    );

    const postComponent = screen.getByTestId('PostComponent');

    expect(postComponent).toBeInTheDocument();
  });
});
