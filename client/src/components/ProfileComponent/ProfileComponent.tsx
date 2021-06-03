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
import { User } from '../../interface/Schemas';
import axios from 'axios';
import { useSelector } from 'react-redux';

interface ID {
  id: string;
}

interface State {
  id: string;
  name: string;
  bio: string;
  img: ImageBitmap;
  avatar: string;
  postNumber: string;
  //TODO:

  postState: string;
  message: string;
}

const ProfileComponent: React.FC = (props) => {
  const [file, setFile] = useState<File>();
  const [filePreview, setFilePreview] = useState<string>();
  const user = useSelector(
    (state: { user: { user: User[] } }) => state.user.user[0]
  );
  const id = useParams<ID>();
  const history = useHistory();
  const [state, setState] = useState({
    id: id.id,
    name: '',
    bio: '',
    img: '',
    avatar: '',
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
    setFilePreview(URL.createObjectURL(e.target.files[0]));
  };

  const onUpdateProfile = () => {
    const formData = new FormData();
    const token = localStorage.getItem('token');
    if (file && token) {
      formData.append('file', file, file.name);
      formData.append('token', token);

      axios.post('api/users/updateProfile', formData);
    }
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
                {/* <img src={state.img} className="img" /> */}
                <img src={user.avatar} className="img" />
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
                  <input type="file" onChange={(e) => handleFileChange(e)} />
                  <Button type="button" onClick={() => onUpdateProfile()}>
                    Upload
                  </Button>
                  <img src={filePreview ? filePreview : ''} />
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
