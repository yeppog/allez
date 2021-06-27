import './PostPageComponent.scss';

import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Tooltip,
  Typography,
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
import React, { ReactNode, useEffect, useState } from 'react';
import { fetchPost, likePost } from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import CommentComponent from '../CommentComponent/CommentComponent';
import Image from './../../static/placeholder.png';

interface ID {
  id: string;
}
interface State {
  liked: boolean;
  mediaType: 'image' | 'video' | null;
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

const PostPageComponent: React.FC = () => {
  const slug = useParams<ID>().id;
  const dispatch = useDispatch();
  const [mappedComponent, setMappedComponent] = useState<ReactNode>();
  const [state, setState] = useState<State>({
    liked: false,
    mediaType: null,
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
      setPost(temp);

      console.log(temp);
      if (temp.comments) {
        setMappedComponent(
          temp.comments.map((comm) => {
            return <CommentComponent props={comm}></CommentComponent>;
          })
        );
      }

      if (temp.likedUsers && user) {
        if (user.username in temp.likedUsers) {
          setState({ ...state, liked: true, mediaType: getMediaType(temp) });
        } else {
          setState({ ...state, liked: false, mediaType: getMediaType(temp) });
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
    <div className="PostPageComponent" data-testid="PostPageComponent">
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
                  <IconButton>
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
              <Divider />
              <CardContent>Comments</CardContent>
              {mappedComponent}
              <Divider />
              <CardContent>
                <FormControl fullWidth>
                  <InputLabel className="comment">Add Comment</InputLabel>
                  <Input
                    fullWidth
                    className="password"
                    type="text"
                    id="add-comment"
                    endAdornment={
                      <InputAdornment position="end">
                        <Button>Post</Button>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default PostPageComponent;
