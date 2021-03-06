import './CreatePostComponent.scss';

import { Alert, Autocomplete } from '@material-ui/lab';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  Input,
  InputLabel,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';

import { CSSTransition } from 'react-transition-group';
import { PostTags } from '../../interface/Schemas';
import axios from 'axios';
import { createPost } from '../../api';
import { gyms } from '../../static/Gyms';
import { join } from 'path';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';

const CreatePostComponent: React.FC = () => {
  const [media, setMedia] = useState<File | null>();
  const [open, setOpen] = React.useState(false);
  const [filePreview, setFilePreview] = useState<string | null>();
  const nodeRef = React.useRef(null);
  const [state, setState] = useState<PostTags>({
    media: '',
    caption: '',
    gym: '',
    route: '',
    people: [],
    errorMessage: '',
  });

  const gym = useSelector(
    (state: { user: { gym: { [key: string]: string }[] } }) => state.user.gym
  );
  const users = useSelector(
    (state: { user: { users: { [key: string]: string }[] } }) =>
      state.user.users
  );

  const history = useHistory();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setState({ ...state, route: '' });
  };
  const handleConfirm = () => {
    setOpen(false);
  };

  const handleAutoCompleteChange =
    (prop: keyof PostTags) => (event: React.ChangeEvent<{}>, value: any) => {
      if (value === null) {
        setState({ ...state, [prop]: '' });
      } else {
        setState({ ...state, [prop]: value });
      }
    };

  const handleChange =
    (prop: keyof PostTags) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setState({ ...state, [prop]: event.target.value });
    };

  const getFriends = () => {
    // TODO: Get Friends
    const friends = [{ username: 'nzixuan' }, { username: 'lenathonaj' }];
    return friends;
  };

  const handleEditMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.files);
    if (e.target.files) {
      if (e.target.files[0]) {
        setMedia(e.target.files[0]);
        setFilePreview(URL.createObjectURL(e.target.files[0]));
      } else {
        setFilePreview(null);
      }
    } else {
      setFilePreview(null);
    }
  };

  const removeMedia = (): void => {
    if (filePreview) {
      setMedia(undefined);
      setFilePreview(undefined);
    }
  };

  const onSubmit = (e: any): void => {
    //TODO: Handle invalid input
    // preventDefault prevents the page from refreshing when the form is submitted
    e.preventDefault();
    const formData = new FormData();
    const token = localStorage.getItem('token') as string;
    if (media) {
      formData.append('file', media, media.name);
    }
    if (!token) {
      console.log('No token, unable to update');
    }
    const usertag = state.people;
    formData.append('body', state.caption);
    formData.append('taggedUser', usertag.join());
    formData.append('taggedGym', state.gym);
    formData.append('taggedRoute', '');
    createPost(formData, token)
      .then((data) => {
        setState({
          media: '',
          caption: '',
          gym: '',
          route: '',
          people: [],
          errorMessage: '',
        });
        setMedia(null);
        history.push('/home');
      })
      .catch((err) => {
        setState({ ...state, errorMessage: err.message });
        console.log(token);
        console.log(err.message);
      });
  };

  return (
    <div className="CreatePostComponent" data-testid="CreatePostComponent">
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        spacing={2}
        xs={10}
        sm={8}
        md={6}
        lg={4}
      >
        <Grid item></Grid>
        <Grid item>
          <form onSubmit={(e) => onSubmit(e)}>
            <Grid
              container
              xs={12}
              spacing={2}
              alignItems="center"
              justify="center"
            >
              <Grid item>
                {filePreview != null ? (
                  media != null && media.type.includes('image') ? (
                    <div className="pseudoImage">
                      <img
                        src={filePreview}
                        alt="file-preview"
                        className="img"
                        width="350"
                        onClick={removeMedia}
                      />
                    </div>
                  ) : media != null && media.type.includes('video') ? (
                    <video
                      width="350"
                      controls
                      src={filePreview}
                      onClick={removeMedia}
                    ></video>
                  ) : (
                    <Typography onClick={removeMedia}>
                      File type not supported
                    </Typography>
                  )
                ) : (
                  <label className="uploadButton">
                    <Input
                      id="mediaInput"
                      className="upload"
                      type="file"
                      // size="small"
                      // variant="text"
                      // color="primary"
                      onChange={handleEditMedia}
                    />{' '}
                    Select Media
                  </label>
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Captions</InputLabel>
                  <Input
                    fullWidth
                    value={state.caption}
                    onChange={handleChange('caption')}
                    disableUnderline
                    multiline
                    rows={3}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    id="gym"
                    options={gym.map((gym) => gym.username)}
                    getOptionLabel={(option) => option}
                    fullWidth
                    onChange={handleAutoCompleteChange('gym')}
                    renderInput={(params) => (
                      <TextField {...params} label="Gym" variant="standard" />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="text"
                  disabled={true}
                  onClick={handleClickOpen}
                >
                  Tag Route
                </Button>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="form-dialog-title"
                >
                  <DialogTitle id="form-dialog-title">Tag Route</DialogTitle>
                  <DialogContent>
                    <DialogContentText>Tag your routes here</DialogContentText>
                    <TextField
                      margin="dense"
                      id="grade"
                      label="Route Grade"
                      type="email"
                      fullWidth
                    />
                    <TextField
                      margin="dense"
                      id="colour"
                      label="Route Colour"
                      type="email"
                      fullWidth
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={handleConfirm} color="primary">
                      Confirm
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* <Input
                    fullWidth
                    value={state.route}
                    onChange={handleChange('route')}
                  /> */}
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    fullWidth
                    multiple
                    id="tags-filled"
                    options={users.map((option) => option.username)}
                    freeSolo
                    onChange={handleAutoCompleteChange('people')}
                    renderTags={(value: string[], getTagProps) =>
                      value.map((option: string, index: number) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label="Tag Friends"
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item>
                <div className="errorAlert">
                  <CSSTransition
                    nodeRef={nodeRef}
                    in={state.errorMessage ? true : false}
                    timeout={1000}
                    unmountOnExit
                    classNames="errorAlert"
                  >
                    <div ref={nodeRef}>
                      <Alert
                        severity="error"
                        onClose={() => setState({ ...state, errorMessage: '' })}
                      >
                        {state.errorMessage}
                      </Alert>
                    </div>
                  </CSSTransition>
                </div>
              </Grid>

              <Grid item xs={12}>
                <Button variant="text" color="primary" type="submit" fullWidth>
                  Post
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreatePostComponent;
