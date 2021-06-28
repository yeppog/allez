import '@testing-library/jest-dom/extend-expect';

import { Comment, Post } from '../../interface/Schemas';
import { render, screen } from '@testing-library/react';

import CommentComponent from './CommentComponent';
import { Provider } from 'react-redux';
import React from 'react';
import store from '../Redux/store';

let post: Post;
let comment: Comment;

describe('<CommentComponent />', () => {
  beforeAll(() => {
    post = {
      mediaPath: 'eifjweofijewf',
      likes: 1,
      likedUsers: ['username'],
      id: '3orj2409fh2409fgjnwfewf',
      username: 'fi4203hf8904hfg3489g4',
      body: 'body',
      avatarPath: 'avatar',
      slug: 'slug',
      tag: { user: 'rihefi4hnf34g' },
      comments: [],
      createdAt: new Date(),
      edited: false,
    } as Post;
    comment = {
      _id: '34ihf80243f423f',
      comments: [],
      body: 'body',
      edited: false,
      username: 'username',
      avatarPath: 'avatar',
      createdAt: new Date(),
    } as Comment;
  });

  test('it should mount', () => {
    render(
      <Provider store={store}>
        <CommentComponent post={post} comment={comment} />
      </Provider>
    );

    const commentComponent = screen.getByTestId('CommentComponent');

    expect(commentComponent).toBeInTheDocument();
  });
});
