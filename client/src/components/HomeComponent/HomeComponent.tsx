import './HomeComponent.scss';

import PostComponent from '../PostComponent/PostComponent';
import React from 'react';

const HomeComponent: React.FC = () => (
  <div className="HomeComponent" data-testid="HomeComponent">
    HomeComponent Component
    <PostComponent></PostComponent>
  </div>
);

export default HomeComponent;
