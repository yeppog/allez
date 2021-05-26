import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BotNavComponent from './BotNavComponent';

describe('<BotNavComponent />', () => {
  test('it should mount', () => {
    render(<BotNavComponent />);
    
    const botNavComponent = screen.getByTestId('BotNavComponent');

    expect(botNavComponent).toBeInTheDocument();
  });
});