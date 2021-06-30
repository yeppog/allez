import './HomeComponent.scss';

import { Post, User } from '../../interface/Schemas';

import PostComponent from '../PostComponent/PostComponent';
import React from 'react';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';

const HomeComponent: React.FC = () => {
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
    .reverse()
    .map((post) => {
      return (
        <PostComponent key={post.slug} post={post} user={user}></PostComponent>
      );
    });

  return (
    <div className="HomeComponent" data-testid="HomeComponent">
      <Typography variant="h4">Feed</Typography>
      {mappedPosts}
    </div>
  );
};

export default HomeComponent;
