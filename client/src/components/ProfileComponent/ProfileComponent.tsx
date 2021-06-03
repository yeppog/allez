import './ProfileComponent.scss';

import {
  Button,
  ButtonBase,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import Image from './../../static/404.png';
import SettingsIcon from '@material-ui/icons/Settings';

interface ID {
  id: string;
}

interface State {
  id: string;
  name: string;
  bio: string;
  img: ImageBitmap;
  postNumber: string;
  //TODO:

  postState: string;
  message: string;
}

const ProfileComponent: React.FC = () => {
  const id = useParams<ID>();
  const history = useHistory();
  const [state, setState] = useState({
    id: id.id,
    name: '',
    bio: '',
    img: '',
    postNumber: 0,
    followNumber: 0,
    myself: true,
    following: false,

    postState: '',
    message: '',
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).toString() + 'mil';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1).toString() + 'k';
    } else {
      return num.toString();
    }
  };

  const handleFollowButton = () => {
    setState({ ...state, following: !state.following });
    //TODO: API calls
  };

  const apiCall = () => {
    setState({
      ...state,
      name: 'Jon',
      bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, voluptate soluta assumenda ut aliquam unde maxime? Omnis alias maxime perspiciatis.',
      img: Image,
      postNumber: 10,
      followNumber: 12300,
      postState: 'sucess',
    });
  };

  useEffect(apiCall, []);
  return (
    <div className="ProfileComponent" data-testid="ProfileComponent">
      {/*  direction="row" */}
      <Grid container direction="row" alignItems="center" justify="center">
        <Grid item xs={10} sm={8} md={6} lg={4}>
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
            spacing={2}
          >
            <Grid item>
              <ButtonBase>
                <img src={state.img} className="img" />
              </ButtonBase>
            </Grid>
            <Grid item>
              <Typography>{state.name}</Typography>
            </Grid>
            <Grid item>
              <Typography>{state.bio}</Typography>
            </Grid>
            <Grid item>
              <Grid container direction="row" spacing={1}>
                <Grid item>
                  <Typography>{formatNumber(state.postNumber)}</Typography>
                </Grid>
                <Grid item>
                  <Typography>posts</Typography>
                </Grid>
                <Grid item></Grid>
                <Grid item></Grid>
                <Grid item>
                  <Typography>{formatNumber(state.followNumber)}</Typography>
                </Grid>
                <Grid item>
                  <Typography>followers</Typography>
                </Grid>
              </Grid>
            </Grid>
            {state.myself ? (
              <Grid container direction="row" justify="flex-end">
                <IconButton
                  aria-label="settings"
                  onClick={() => {
                    history.push('/edit/profile');
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Grid>
            ) : (
              <Grid item>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={handleFollowButton}
                >
                  {state.following ? 'Following' : 'Follow'}
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfileComponent;
