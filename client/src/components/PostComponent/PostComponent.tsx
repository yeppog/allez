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
import React, { useState } from 'react';

import Image from './../../static/placeholder.png';
import { Post } from '../../interface/Schemas';
import { useHistory } from 'react-router';

interface State {
  liked: boolean;
}

interface PostProps {
  key: string;
  post: Post;
}

const PostComponent: React.FC<PostProps> = ({ post }) => {
  const [state, setState] = useState<State>({
    liked: false,
  });
  const history = useHistory();
  console.log(post);
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
                <IconButton
                  onClick={() => setState({ ...state, liked: !state.liked })}
                >
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
    </div>
  );
};

export default PostComponent;
