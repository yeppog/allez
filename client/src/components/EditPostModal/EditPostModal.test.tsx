import '@testing-library/jest-dom/extend-expect';

import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';

import EditPostModal from './EditPostModal';
import { Post } from '../../interface/Schemas';
import { Provider } from 'react-redux';
import store from '../Redux/store';

let post: Post;

interface Props {
  post: Post;
}

const FakeComponent: React.FC<Props> = ({ post }) => {
  const [editModal, setEditModal] = useState<boolean>(false);
  return (
    <div>
      <EditPostModal
        post={post}
        editModal={editModal}
        setEditModal={setEditModal}
      />
    </div>
  );
};

describe('<EditPostModal />', () => {
  beforeEach(() => {
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
  });

  test('it should mount', () => {
    render(
      <Provider store={store}>
        <FakeComponent post={post} />
      </Provider>
    );

    const editPostModal = screen.getByTestId('EditPostModal');

    expect(editPostModal).toBeInTheDocument();
  });
});
