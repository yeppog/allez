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
  Menu,
  MenuItem,
  Modal,
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
  Warning,
} from '@material-ui/icons';
import { Post, User } from '../../interface/Schemas';
import React, { ReactNode, useEffect, useState } from 'react';
import { deletePost, fetchPost, likePost } from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import CommentComponent from '../CommentComponent/CommentComponent';
import DeleteModal from '../DeleteModal/DeleteModal';
import Image from './../../static/placeholder.png';
import { removePost } from '../Redux/postSlice';

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
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
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
    fetchPost({ slug: slug }).then((data) => {
      const temp = data as Post;
      setPost(temp);

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
  }, [user]);

  const history = useHistory();

  const handleLike = () => {
    const token = localStorage.getItem('token');
    if (token) {
      likePost({ slug: slug, token: token }).then((data) => {
        const temp = data as Post;
        setPost(temp);
      });
    }
  };

  const handleDeleteRequest = () => {
    setDeleteConfirm(true);
    setAnchor(null);
  };

  const handleDelete = () => {
    const token = localStorage.getItem('token');
    if (token && post) {
      deletePost({ token: token, slug: slug }).then((data) => {
        // TODO: UPDATE REDUX STORE
        removePost({ slug: post.slug, date: post.createdAt });
        setDeleteConfirm(false);
        history.push('/home');
      });
    }
  };

  return (
    // TODO: Abstract out into a
    <div className="PostPageComponent" data-testid="PostPageComponent">
      <DeleteModal
        slug={slug}
        setDeleteConfirm={setDeleteConfirm}
        deleteConfirm={deleteConfirm}
        post={post}
      />
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
                  <div>
                    <Tooltip title="Actions">
                      <IconButton
                        aria-label=""
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                          setAnchor(e.currentTarget)
                        }
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={anchor}
                      keepMounted
                      open={Boolean(anchor)}
                      onClose={() => setAnchor(null)}
                    >
                      <MenuItem onClick={handleDeleteRequest}>
                        <Warning style={{ paddingRight: '5px' }} /> Delete Post
                      </MenuItem>
                    </Menu>
                  </div>
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
                {/* <Tooltip title="Share"> */}
                <IconButton disabled>
                  <Share />
                </IconButton>
                {/* </Tooltip> */}
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
