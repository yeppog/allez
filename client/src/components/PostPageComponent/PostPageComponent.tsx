import './PostPageComponent.scss';

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
import { fetchPost, likePost } from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import Image from './../../static/placeholder.png';

interface State {
  liked: boolean;
}

interface ID {
  id: string;
}

const PostPageComponent: React.FC = () => {
  const slug = useParams<ID>().id;
  const dispatch = useDispatch();
  const [state, setState] = useState<State>({
    liked: false,
  });
  const [post, setPost] = useState<Post>();

  const user = useSelector((state: { user: { user: User } }) => {
    return state.user.user;
  });

  // sets the like button to be checked or not
  useEffect(() => {
    console.log(slug);
    fetchPost({ slug: slug }).then((data) => {
      const temp = data as Post;
      console.log(temp);
      setPost(temp);
      if (temp.likedUsers) {
        if (user) {
          if (user.username in temp.likedUsers) {
            setState({ ...state, liked: true });
          } else {
            setState({ ...state, liked: false });
          }
        }
      }
    });
    // console.log(post.likedUsers);
  }, [user]);

  const history = useHistory();
  // console.log(post);

  const handleLike = () => {
    const token = localStorage.getItem('token');
    if (token) {
      likePost({ slug: slug, token: token }).then((data) => {
        const temp = data as Post;
        setPost(temp);
      });
    }
  };

  return (
    <div className="PostPageComponent" data-testid="PostComponent">
      {post && (
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
                component="video"
                title=""
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
                  <IconButton>
                    <ChatBubble></ChatBubble>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share">
                  <IconButton>
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
      )}
    </div>
  );
};

export default PostPageComponent;
