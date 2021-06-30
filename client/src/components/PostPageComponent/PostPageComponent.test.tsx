import '@testing-library/jest-dom/extend-expect';

import { render, screen } from '@testing-library/react';

import PostPageComponent from './PostPageComponent';
import { Provider } from 'react-redux';
import React from 'react';
import store from '../Redux/store';

describe('<PostPageComponent />', () => {
  test('it should mount', () => {
    render(
      <Provider store={store}>
        <PostPageComponent />
      </Provider>
    );

    const postPageComponent = screen.getByTestId('PostPageComponent');

    expect(postPageComponent).toBeInTheDocument();
  });
});
