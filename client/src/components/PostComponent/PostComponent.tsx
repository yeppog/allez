import './PostComponent.scss';

import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Drawer,
  Grid,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import {
  ChatBubble,
  Info,
  MoreVert as MoreVertIcon,
  Share,
  ThumbUpAlt,
  ThumbUpAltOutlined,
} from '@material-ui/icons';
import { Post, User } from '../../interface/Schemas';
import React, { useEffect, useState } from 'react';

import Image from './../../static/placeholder.png';
import { likePost } from '../Redux/postSlice';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

interface State {
  liked: boolean;
  mediaType: 'image' | 'video' | null;
}

interface PostProps {
  key: string;
  post: Post;
  user: User;
}

function getMediaType(post: Post): 'video' | 'image' {
  const split = post.mediaPath.split('.');
  const fileType = split[split.length - 1];

  if (fileType === 'png' || fileType === 'jpeg') {
    return 'image';
  } else {
    return 'video';
  }
}

const PostComponent: React.FC<PostProps> = ({ post, user }) => {
  const dispatch = useDispatch();
  const [state, setState] = useState<State>({
    liked: false,
    mediaType: null,
  });

  // sets the like button to be checked or not
  useEffect(() => {
    const mediaType = getMediaType(post);
    if (post.likedUsers) {
      if (user.username in post.likedUsers) {
        setState({ ...state, liked: true, mediaType: mediaType });
      } else {
        setState({ ...state, liked: false, mediaType: mediaType });
      }
    }
  }, [post, user]);

  const history = useHistory();

  const handleLike = () => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(likePost({ token: token, slug: post.slug }));
    }
  };

  return (
    <div className="PostComponent" data-testid="PostComponent">
      <Grid container spacing={1} justify="center" alignItems="center">
        <Grid item xs={10} sm={8} md={6} lg={4}>
          <Card className="cardBody">
            <CardHeader
              avatar={
                <Tooltip title="View Profile">
                  <Avatar
                    aria-label=""
                    onClick={() => history.push(`/profile/${post.username}`)}
                  >
                    <img
                      src={post.avatarPath}
                      style={{ maxWidth: '40px' }}
                    ></img>
                  </Avatar>
                </Tooltip>
              }
              action={
                <Tooltip title="Actions">
                  <IconButton aria-label="">
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
              }
              title={post.username}
              subheader={post.id}
              style={{ position: 'relative' }}
            />
            <CardMedia
              controls
              className={state.mediaType === 'image' ? 'img' : 'video'}
              component={state.mediaType === 'image' ? 'img' : 'video'}
              title="Test"
              src={post.mediaPath}
            />
            <CardContent className="mediaBody">{post.body}</CardContent>
            <CardActions
              style={{
                justifyContent: 'flex-end',
                display: 'flex',
              }}
            >
              {post.likes}
              <Tooltip title="Like">
                <IconButton onClick={handleLike}>
                  {state.liked ? <ThumbUpAlt /> : <ThumbUpAltOutlined />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Comment">
                <IconButton onClick={() => history.push(`/post/${post.slug}`)}>
                  <ChatBubble></ChatBubble>
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton disabled>
                  <Share />
                </IconButton>
              </Tooltip>
              <Tooltip title="Beta Info">
                <IconButton>
                  <Info />
                </IconButton>
              </Tooltip>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default PostComponent;
