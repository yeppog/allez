import './ProfileComponent.scss';

import {
  Button,
  ButtonBase,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import { PublicUser, User } from '../../interface/Schemas';
import React, { useEffect, useState } from 'react';
import { addFollow, removeFollow } from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import Image from './../../static/404.png';
import SettingsIcon from '@material-ui/icons/Settings';
import axios from 'axios';

interface ID {
  id: string;
}

interface State {
  id: string;
  name: string;
  bio: string;
  img: ImageBitmap;
  avatarPath: string;
  postNumber: string;
  //TODO:

  postState: string;
  message: string;
}

const ProfileComponent: React.FC = (props) => {
  const history = useHistory();
  const username = useParams<ID>().id;
  const loggedInUser = useSelector((state: { user: { user: User } }) => {
    return state.user.user;
  });
  const [user, setUser] = useState<PublicUser>({
    name: '',
    username: '',
    avatarPath: '',
    bio: '',
    followCount: 0,
    followers: {},
    following: [],
    followingCount: 0,
    taggedPost: {},
  });
  /** Fetch the specified user on load */
  useEffect(() => {
    console.log('test');
    if (loggedInUser.username == username) {
      console.log('wat');
      setState({ ...state, myself: true });
      setUser(loggedInUser);
    } else {
      setState({ ...state, myself: false });
      axios
        .get('api/users/getPublicProfile', {
          headers: { username: username },
        })
        .then((data) => {
          setUser(data.data);
          if (loggedInUser.following) {
            if (loggedInUser.following.includes(username)) {
              // myself is set to false as the async setstate may call the previous ...state value where myself was true
              setState({ ...state, following: true, myself: false });
            }
          }
        });
    }
  }, [axios, username, loggedInUser, history]);

  const handleFetchUser = (prop: keyof PublicUser, data: any) => {
    setState({ ...state, [prop]: data });
  };

  const [state, setState] = useState({
    // to migrate to user in the future
    postNumber: 0,
    followNumber: 0,
    myself: false,
    following: false,

    postState: '',
    message: '',
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 100000) % 10 == 0
        ? (num / 1000000).toFixed().toString() + 'm'
        : (num / 1000000).toFixed(1).toString() + 'm';
    } else if (num >= 1000) {
      return (num / 100) % 10 == 0
        ? (num / 1000).toFixed().toString() + 'k'
        : (num / 1000).toFixed(1).toString() + 'k';
    } else {
      return num.toString();
    }
  };

  const handleFollowButton = () => {
    if (state.following) {
      removeFollow({ user: loggedInUser.username, target: username }).then(
        (data) => console.log(data)
      );
    } else {
      addFollow({ user: loggedInUser.username, target: username });
    }
    setState({ ...state, following: !state.following });
    //TODO: Implement backend api for following users
  };

  return (
    <div className="ProfileComponent" data-testid="ProfileComponent">
      {/*  direction="row" */}
      <Grid container direction="row" alignItems="center" justify="center">
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={4}
          container
          direction="column"
          alignItems="center"
          justify="center"
          spacing={2}
        >
          <Grid item container direction="row" alignItems="stretch">
            <Grid item>
              <ButtonBase>
                {/* <img src={state.img} className="img" /> */}
                <img
                  src={user.avatarPath ? user.avatarPath : Image}
                  className="img"
                />
              </ButtonBase>
            </Grid>
            <Grid item alignItems="stretch">
              <Grid
                item
                container
                direction="column"
                alignItems="stretch"
                spacing={4}
              >
                <Grid item container alignItems="center" spacing={4}>
                  <Grid item>
                    <Typography variant="h5" style={{ fontWeight: 600 }}>
                      {user.username}
                    </Typography>
                  </Grid>
                  {state.myself ? (
                    <IconButton
                      aria-label="settings"
                      onClick={() => {
                        history.push('/editProfile');
                      }}
                    >
                      <SettingsIcon />
                    </IconButton>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={handleFollowButton}
                    >
                      {state.following ? 'Following' : 'Follow'}
                    </Button>
                  )}
                </Grid>
                <Grid item>
                  <Grid container direction="row" spacing={1}>
                    <Grid item>
                      <Grid
                        container
                        direction="column"
                        spacing={1}
                        alignItems="center"
                        justify="center"
                      >
                        <Grid item>
                          <Typography>
                            {state.postNumber
                              ? formatNumber(state.postNumber)
                              : 0}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography>&emsp;Posts&emsp;</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item></Grid>
                    <Grid item></Grid>
                    <Grid item>
                      <Grid
                        container
                        direction="column"
                        spacing={1}
                        alignItems="center"
                        justify="center"
                      >
                        <Grid item>
                          <Typography>
                            {user.followCount
                              ? formatNumber(user.followCount)
                              : 0}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography>&ensp;Followers&ensp;</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            {/* TODO: Needs to align left since this text can overflow */}
            <Typography>
              <strong>{user.name}</strong>
            </Typography>
            <Typography>{user.bio}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfileComponent;
