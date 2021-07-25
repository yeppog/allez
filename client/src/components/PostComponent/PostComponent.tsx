import './PostComponent.scss';

import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  ChatBubble,
  Edit,
  Info,
  MoreVert as MoreVertIcon,
  Share,
  ThumbUpAlt,
  ThumbUpAltOutlined,
  Warning,
} from '@material-ui/icons';
import { Post, User } from '../../interface/Schemas';
import React, { useEffect, useState } from 'react';

import DeleteModal from '../DeleteModal/DeleteModal';
import EditPostModal from '../EditPostModal/EditPostModal';
import { formatTimeToString } from '../../formatNumber';
import { likePost } from '../Redux/postSlice';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

interface State {
  liked: boolean;
  mediaType: 'image' | 'video' | null;
}

interface PostProps {
  post: Post;
  user: User;
}

function getMediaType(post: Post): 'video' | 'image' {
  const split = post.mediaPath.split('.');
  const fileType = split[split.length - 1];

  if (fileType === 'png' || fileType === 'jpeg' || fileType === 'jpg') {
    return 'image';
  } else {
    return 'video';
  }
}

const PostComponent: React.FC<PostProps> = ({ post, user }) => {
  const dispatch = useDispatch();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
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
  const handleDeleteRequest = () => {
    setDeleteConfirm(true);
    setAnchor(null);
  };

  return (
    <div className="PostComponent" data-testid="PostComponent">
      <DeleteModal
        slug={post.slug}
        setDeleteConfirm={setDeleteConfirm}
        deleteConfirm={deleteConfirm}
        post={post}
        type="post"
      />
      <EditPostModal
        post={post}
        editModal={editModal}
        setEditModal={setEditModal}
      />
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
                    <MenuItem onClick={() => setEditModal(true)}>
                      <Edit style={{ paddingRight: '5px' }} /> Edit Post
                    </MenuItem>
                  </Menu>
                </div>
              }
              title={post.username}
              subheader={`${formatTimeToString(
                Date.now() - new Date(post.createdAt).getTime()
              )}  ${post.edited ? '· Edited' : ''} `}
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
              <Typography>{post.comments.length}</Typography>
              <Tooltip title="Comment">
                <IconButton onClick={() => history.push(`/post/${post.slug}`)}>
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
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default PostComponent;
