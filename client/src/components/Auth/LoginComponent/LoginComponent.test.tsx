import '@testing-library/jest-dom/extend-expect';

import { Store, combineReducers, createStore } from 'redux';
import { render, screen } from '@testing-library/react';

import LoginComponent from './LoginComponent';
import { Provider } from 'react-redux';
import React from 'react';
import postReducer from '../../Redux/postSlice';
import store from '../../Redux/store';
import userReducer from '../../Redux/userSlice';

describe('<LoginComponent />', () => {
  test('it should mount', () => {
    render(
      <Provider store={store}>
        <LoginComponent />
      </Provider>
    );

    const loginComponent = screen.getByTestId('LoginComponent');

    expect(loginComponent).toBeInTheDocument();
  });
});
