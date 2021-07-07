import './ProfileSettingsComponent.scss';

import {
  Button,
  FormControl,
  Grid,
  Input,
  InputLabel,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { User } from '../../interface/Schemas';
import axios from 'axios';
import { updateUser } from '../Redux/userSlice';
import { useHistory } from 'react-router';
import { editProfile } from '../../api';

const ProfileSettingsComponent: React.FC = () => {
  const [avatar, setAvatar] = useState<File | null>();
  const [filePreview, setFilePreview] = useState<string | null>();
  const [state, setState] = useState<User>({
    name: '',
    username: '',
    bio: '',
    avatarPath: '',
    email: '',
    followCount: 0,
    followers: {},
    following: [],
    followingCount: 0,
    taggedPost: {},
    postCount: 0,
  });
  const user = useSelector(
    (state: { user: { user: User } }) => state.user.user
  );
  useEffect(() => {
    if (user) {
      setState(user);
    }
  }, [user]);
  const history = useHistory();
  const handleChange =
    (prop: keyof User) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setState({ ...state, [prop]: event.target.value });
    };
  const dispatch = useDispatch();

  const handleEditPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    if (e.target.files) {
      if (e.target.files[0]) {
        setAvatar(e.target.files[0]);
        setFilePreview(URL.createObjectURL(e.target.files[0]));
      } else {
        setFilePreview(null);
      }
    } else {
      setFilePreview(null);
    }
  };

  // Deletes the existing photo iff upload preview has been made
  const removeAvatar = (): void => {
    const a = document.getElementById('avatarInput') as HTMLInputElement;
    a.value = '';
    if (filePreview) {
      setAvatar(undefined);
      setFilePreview(undefined);
    }
  };

  const onSubmit = (e: any): void => {
    // preventDefault prevents the page from refreshing when the form is submitted
    e.preventDefault();
    const formData = new FormData();
    const token = localStorage.getItem('token') as string;
    if (avatar) {
      formData.append('file', avatar, avatar.name);
    }
    if (!token) {
      console.log('No token, unable to update');
    }
    // TODO: create API to change username to ensure no clash in username
    // formData.append('username', user.username);
    formData.append('name', state.name);
    formData.append('token', token);
    formData.append('bio', state.bio);
    // dispatch(updateUserProfile(formData));
    editProfile(formData)
      .then((data) => {
        setState(data);
        setAvatar(null);
        dispatch(updateUser(data as User));
        history.goBack();
      })
      .catch((err) => {
        // TODO: Handle user errors
        console.log(err);
      });
  };

  // TODO: Add a back button to go back to the previous page user was on.
  return (
    <div
      className="ProfileSettingsComponent"
      data-testid="ProfileSettingsComponent"
    >
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
              {/* TODO: Implement hover cross to "delete" the picture */}
              <div className="pseudoImage">
                <img
                  alt="file-preview"
                  src={filePreview != null ? filePreview : state.avatarPath}
                  className="img"
                  onClick={removeAvatar}
                />
              </div>
              <label className="uploadButton">
                <Input
                  id="avatarInput"
                  className="upload"
                  type="file"
                  // size="small"
                  // variant="text"
                  // color="primary"
                  onChange={handleEditPhoto}
                />{' '}
                Change Profile Picture
              </label>
              {/* 
                Click the photo to remove selection. Im too lazy to draw an X
                over it for now
             */}
            </Grid>
            <Grid item lg={12}>
              <form onSubmit={(e) => onSubmit(e)}>
                <Grid
                  container
                  xs={12}
                  spacing={2}
                  alignItems="center"
                  justify="center"
                >
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Display Name</InputLabel>
                      <Input
                        fullWidth
                        value={state.name}
                        onChange={handleChange('name')}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Username</InputLabel>
                      <Input
                        fullWidth
                        value={state.username}
                        onChange={handleChange('username')}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Bio</InputLabel>
                      <Input
                        value={state.bio}
                        onChange={handleChange('bio')}
                        fullWidth
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="text"
                      color="primary"
                      type="submit"
                      fullWidth
                    >
                      Confirm
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfileSettingsComponent;
