import './CommentComponent.scss';

import {
  Avatar,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Comment, Post } from '../../interface/Schemas';
import { MoreVert as MoreVertIcon, Warning } from '@material-ui/icons';
import React, { useState } from 'react';

import DeleteModal from '../DeleteModal/DeleteModal';
import { formatTimeToString } from '../../formatNumber';
import { useHistory } from 'react-router';

interface CommentProps {
  comment: Comment;
  slug?: string;
  post?: Post;
  setPost?: React.Dispatch<React.SetStateAction<Post | undefined>>;
}
const CommentComponent: React.FC<CommentProps> = ({
  comment,
  slug,
  post,
  setPost,
}) => {
  const history = useHistory();
  const date = new Date(comment.createdAt);
  const diff = Date.now() - date.getTime();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

  const handleDeleteRequest = () => {
    setDeleteConfirm(true);
    setAnchor(null);
  };

  return (
    <div className="CommentComponent" data-testid="CommentComponent">
      {slug && (
        <DeleteModal
          slug={slug}
          setDeleteConfirm={setDeleteConfirm}
          deleteConfirm={deleteConfirm}
          setPost={setPost}
          comment={comment}
          post={post}
          type="comment"
        />
      )}
      <Divider />
      <CardContent>
        <Grid container direction="column" spacing={2}>
          <Grid item container spacing={2}>
            <Grid item>
              <Tooltip title="View Profile">
                <Avatar
                  aria-label=""
                  onClick={() => history.push(`/profile/${comment.username}`)}
                >
                  <img
                    alt="avatar-profile"
                    src={comment.avatarPath}
                    style={{ maxWidth: '40px' }}
                  ></img>
                </Avatar>
              </Tooltip>
            </Grid>
            <Grid item style={{ flex: '1 0', overflowWrap: 'anywhere' }}>
              <Typography variant="h6">
                <Link
                  href="#"
                  onClick={() => history.push(`/profile/${comment.username}`)}
                  color="inherit"
                >
                  {comment.username}
                </Link>
              </Typography>
              <Typography variant="caption">{comment.body}</Typography>
            </Grid>
            <Grid item style={{ justifySelf: 'flex-end' }}>
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
            </Grid>

            {/* TODO: Like for comments
        
        <CardActions
                style={{
                  justifyContent: 'flex-end',
                  display: 'flex',
                }}
              >
  
                <Tooltip title="Like">
                  <IconButton onClick={handleLike}>
                    {state.liked ? <ThumbUpAlt /> : <ThumbUpAltOutlined />}
                  </IconButton>
                </Tooltip> */}
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">
              {formatTimeToString(diff)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </div>
  );
};

export default CommentComponent;
