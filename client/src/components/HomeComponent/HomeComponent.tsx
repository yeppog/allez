import './HomeComponent.scss';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Post, User } from '../../interface/Schemas';
import PostComponent from '../PostComponent/PostComponent';
import { fetchPosts } from '../Redux/postSlice';

const HomeComponent: React.FC = () => {
  const dispatch = useDispatch();
  // const [postsArr, setPostsArr] = useState<Post[]>([]);

  const user = useSelector((state: { user: { user: User } }) => {
    return state.user.user;
  });
  const posts = useSelector(
    (state: { posts: { posts: { [key: string]: Post } } }) => state.posts.posts
  );

  const mappedPosts = Object.keys(posts)
    .reverse()
    .flatMap((key) => posts[key])
    .map((post) => {
      return (
        <PostComponent key={post.id} post={post} user={user}></PostComponent>
      );
    });

  return (
    <div className="HomeComponent" data-testid="HomeComponent">
      {mappedPosts}
      {/* <PostComponent></PostComponent> */}
    </div>
  );
};

export default HomeComponent;
