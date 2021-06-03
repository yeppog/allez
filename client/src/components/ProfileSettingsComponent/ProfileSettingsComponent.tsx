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

import Image from './../../static/404.png';

interface State {
  id: string;
  name: string;
  bio: string;
  img: ImageBitmap;
  email: string;

  postState: string;
  message: string;
}

const ProfileSettingsComponent: React.FC = () => {
  const [state, setState] = useState({
    id: '',
    name: '',
    bio: '',
    img: '',
    email: '',

    postState: '',
    message: '',
  });

  const apiCall = () => {
    setState({
      ...state,
      id: '123',
      name: 'Jon',
      bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, voluptate soluta assumenda ut aliquam unde maxime? Omnis alias maxime perspiciatis.',
      img: Image,
      email: 'jon@gmail.com',
      postState: 'sucess',
    });
  };

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setState({ ...state, [prop]: event.target.value });
    };

  const handleEditPhoto = () => {
    //TODO:
  };

  const onSubmit = (e: any): void => {
    // preventDefault prevents the page from refreshing when the form is submitted
    e.preventDefault();
    //TODO: API Stuuf
  };
  useEffect(apiCall, []);
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
              <img src={state.img} className="img" />
              <Button
                size="small"
                variant="text"
                color="primary"
                onClick={handleEditPhoto}
              >
                Edit Profile Picture
              </Button>
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
                  <FormControl>
                    <InputLabel>Display Name</InputLabel>
                    <Input value={state.name} onChange={handleChange('name')} />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl>
                    <InputLabel>Username</InputLabel>
                    <Input value={state.id} onChange={handleChange('id')} />
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
