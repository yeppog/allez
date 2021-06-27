import './CommentComponent.scss';

import {
  Avatar,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Link,
  Tooltip,
  Typography,
} from '@material-ui/core';

import { Comment } from '../../interface/Schemas';
import React from 'react';
import { comment } from 'postcss';
import { formatTimeToString } from '../../formatNumber';
import { useHistory } from 'react-router';

interface CommentProps {
  props: Comment;
}
const CommentComponent: React.FC<CommentProps> = ({ props }) => {
  const history = useHistory();
  const date = new Date(props.createdAt);
  const diff = Date.now() - date.getTime();
  return (
    <div className="CommentComponent" data-testid="CommentComponent">
      <Divider />
      <CardContent>
        <Grid container direction="column" spacing={2}>
          <Grid item container alignItems="center" spacing={2}>
            <Grid item>
              <Tooltip title="View Profile">
                <Avatar
                  aria-label=""
                  onClick={() => history.push(`/profile/${props.username}`)}
                >
                  <img
                    src={props.avatarPath}
                    style={{ maxWidth: '40px' }}
                  ></img>
                </Avatar>
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography variant="h6">
                <Link
                  href="#"
                  onClick={() => history.push(`/profile/${props.username}`)}
                  color="inherit"
                >
                  {props.username}
                </Link>
              </Typography>
              <Typography variant="caption">{props.body}</Typography>
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
