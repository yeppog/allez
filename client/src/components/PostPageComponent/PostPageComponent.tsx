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
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Tooltip,
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
import { addComment, fetchPost, likePost } from '../../api';
import { useHistory, useParams } from 'react-router';

import { Alert } from '@material-ui/lab';
import { CSSTransition } from 'react-transition-group';
import CommentComponent from '../CommentComponent/CommentComponent';
import DeleteModal from '../DeleteModal/DeleteModal';
import { formatTimeToString } from '../../formatNumber';
import { useSelector } from 'react-redux';

interface ID {
  id: string;
}
interface State {
  liked: boolean;
  mediaType: 'image' | 'video' | null;
  comment: string;
  errorMessage: string;
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

const PostPageComponent: React.FC = () => {
  const slug = useParams<ID>().id;
  const nodeRef = React.useRef(null);
  const [mappedComponent, setMappedComponent] = useState<ReactNode>();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const [state, setState] = useState<State>({
    liked: false,
    mediaType: null,
    comment: '',
    errorMessage: '',
  });
  const [post, setPost] = useState<Post>();

  const user = useSelector((state: { user: { user: User } }) => {
    return state.user.user;
  });

  // sets the like button to be checked or not
  useEffect(() => {
    console.log(post);
    console.log(state);
    if (!post) {
      fetchPost({ slug: slug }).then((data) => {
        const temp = data as Post;
        setPost(temp);
        if (temp.likedUsers && user) {
          if (user.username in temp.likedUsers) {
            setState({ ...state, liked: true, mediaType: getMediaType(temp) });
          } else {
            setState({ ...state, liked: false, mediaType: getMediaType(temp) });
          }
        }
      });
    } else {
      setMappedComponent(
        post.comments.map((comm, index) => {
          return (
            <CommentComponent
              key={index}
              comment={comm}
              slug={post.slug}
              post={post}
              setPost={setPost}
            ></CommentComponent>
          );
        })
      );
    }
  }, [user, post, slug, state]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token && /\S/.test(state.comment)) {
      addComment({ token: token, slug: slug, body: state.comment })
        .then((data) => {
          const oldPost = post as Post;
          setPost({ ...oldPost, comments: [...oldPost.comments, data] });
          setState({
            ...state,
            comment: '',
          });
        })
        .catch((err) => {
          setState({ ...state, errorMessage: err.message });
          console.log(err);
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
        type="post"
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
                        alt="avatar"
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
                  <form onSubmit={handleSubmit}>
                    <InputLabel className="comment">Add Comment</InputLabel>
                    <Input
                      fullWidth
                      className="password"
                      type="text"
                      id="add-comment"
                      value={state.comment}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setState({ ...state, comment: event.target.value });
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <Button type="submit">Post</Button>
                        </InputAdornment>
                      }
                    />
                  </form>
                </FormControl>
                <div className="errorAlert">
                  <CSSTransition
                    nodeRef={nodeRef}
                    in={state.errorMessage ? true : false}
                    timeout={1000}
                    unmountOnExit
                    classNames="errorAlert"
                  >
                    <div ref={nodeRef}>
                      <Alert
                        severity="error"
                        onClose={() => setState({ ...state, errorMessage: '' })}
                      >
                        {state.errorMessage}
                      </Alert>
                    </div>
                  </CSSTransition>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default PostPageComponent;
