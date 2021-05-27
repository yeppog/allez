import '@testing-library/jest-dom/extend-expect';

import { render, screen } from '@testing-library/react';

import React from 'react';
import TopNavComponent from './TopNavComponent';

describe('<TopNavComponent />', () => {
  test('it should mount', () => {
    render(<TopNavComponent />);

    const topNavComponent = screen.getByTestId('TopNavComponent');

    expect(topNavComponent).toBeInTheDocument();
  });
});
