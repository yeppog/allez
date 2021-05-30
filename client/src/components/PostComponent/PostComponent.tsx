import './PostComponent.scss';

import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  LinearProgress,
  Grid,
  Tooltip,
} from '@material-ui/core';
import {
  ChatBubble,
  ChatBubbleOutline,
  Info,
  InfoOutlined,
  MoreVert as MoreVertIcon,
  Share,
  ShareOutlined,
  ThumbUpAlt,
  ThumbUpAltOutlined,
} from '@material-ui/icons';
import React, { useState } from 'react';

import Image from './../../static/placeholder.png';

interface State {
  liked: boolean;
}

const PostComponent: React.FC = () => {
  const [state, setState] = useState<State>({
    liked: false,
  });
  return (
    <div className="PostComponent" data-testid="PostComponent">
      <Grid container spacing={1} justify="center" alignItems="center">
        <Grid item xs={10} sm={8} md={6} lg={4}>
          <Card className="cardBody">
            <CardHeader
              avatar={
                <Tooltip title="View Profile">
                  <Avatar aria-label="">P</Avatar>
                </Tooltip>
              }
              action={
                <Tooltip title="Actions">
                  <IconButton aria-label="">
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
              }
              title=""
              subheader=""
              style={{ position: 'relative' }}
            />
            <CardMedia component="img" title="" src={Image} />
            <CardContent className="mediaBody">
              This is a sample card!
            </CardContent>
            <CardActions
              style={{
                justifyContent: 'flex-end',
                display: 'flex',
              }}
            >
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
