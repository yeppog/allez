import './ProfileSettingsComponent.scss';

import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Image from './../../static/404.png';
import { User } from '../../interface/Schemas';
import axios from 'axios';

const ProfileSettingsComponent: React.FC = () => {
  const [avatar, setAvatar] = useState<File | null>();
  const [filePreview, setFilePreview] = useState<string | null>();
  const [state, setState] = useState<User>({
    name: '',
    username: '',
    bio: '',
    avatar: '',
    email: '',
    followCount: 0,
    followers: {},
  });
  const user = useSelector(
    (state: { user: { user: User } }) => state.user.user
  );
  useEffect(() => {
    if (user) {
      setState(user);
    }
  }, [user]);

  // const apiCall = () => {
  //   setState({
  //     ...state,
  //     id: '123',
  //     name: 'Jon',
  //     bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, voluptate soluta assumenda ut aliquam unde maxime? Omnis alias maxime perspiciatis.',
  //     img: Image,
  //     email: 'jon@gmail.com',
  //     postState: 'sucess',
  //   });
  // };

  const handleChange =
    (prop: keyof User) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setState({ ...state, [prop]: event.target.value });
    };

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
    //TODO: API Stuuf
    const formData = new FormData();
    const token = localStorage.getItem('token') as string;
    if (avatar) {
      formData.append('file', avatar, avatar.name);
    }
    if (!token) {
      console.log('No token, unable to update');
    }
    // formData.append('username', user.username);
    formData.append('name', state.name);
    formData.append('token', token);
    formData.append('bio', state.bio);
    // dispatch(updateUserProfile(formData));
    axios
      .post('/api/users/updateProfile', formData)
      .then((data) => {
        setState(data.data);
        setAvatar(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };
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
                  src={filePreview != null ? filePreview : state.avatar}
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
              <h3>
                Click the photo to remove selection. Im too lazy to draw an X
                over it for now
              </h3>
            </Grid>
            <form onSubmit={(e) => onSubmit(e)}>
              <Grid
                container
                direction="column"
                alignItems="center"
                justify="center"
                spacing={2}
              >
                <Grid item>
                  <FormControl fullWidth>
                    <InputLabel>Display Name</InputLabel>
                    <Input
                      fullWidth
                      value={state.name}
                      onChange={handleChange('name')}
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl>
                    <InputLabel>Username</InputLabel>
                    <Input
                      value={state.username}
                      onChange={handleChange('username')}
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl>
                    <InputLabel>Bio</InputLabel>
                    <Input value={state.bio} onChange={handleChange('bio')} />
                  </FormControl>
                </Grid>
                <Grid item>
                  <Button variant="text" color="primary" type="submit">
                    Confirm
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfileSettingsComponent;
