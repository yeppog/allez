import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PostPageComponent from './PostPageComponent';

describe('<PostPageComponent />', () => {
  test('it should mount', () => {
    render(<PostPageComponent />);
    
    const postPageComponent = screen.getByTestId('PostPageComponent');

    expect(postPageComponent).toBeInTheDocument();
  });
});