import './EditPostModal.scss';

import {
  Button,
  Card,
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
  Modal,
  TextField,
  Typography,
} from '@material-ui/core';
import { Comment, Post, PostTags } from '../../interface/Schemas';
import React, { useState } from 'react';
import { deleteComment, deletePost, editPost } from '../../api';
import { editPostAction, removePost } from '../Redux/postSlice';

import { Autocomplete } from '@material-ui/lab';
import { gyms } from '../../static/Gyms';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

interface Props {
  post: Post;
  editModal: boolean;
  setEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface State {
  body: string;
  tag: string;
}

const EditPostModal: React.FC<Props> = ({ post, editModal, setEditModal }) => {
  const [media, setMedia] = useState<File>();
  const [open, setOpen] = React.useState(false);
  const [filePreview, setFilePreview] = useState<string | null>();
  const [state, setState] = useState<PostTags>({
    media: post.mediaPath,
    caption: post.body,
    gym: '',
    route: '',
    people: '',
  });
  const dispatch = useDispatch();

  const handleChange =
    (prop: keyof PostTags) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setState({ ...state, [prop]: event.target.value });
    };

  const handleAutoCompleteChange =
    (prop: keyof PostTags) => (event: React.ChangeEvent<{}>, value: any) => {
      if (value == null) {
        setState({ ...state, [prop]: '' });
      } else {
        setState({ ...state, [prop]: value });
      }
    };

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

  const getFriends = () => {
    // TODO: Get Friends
    const friends = [{ username: 'nzixuan' }, { username: 'lenathonaj' }];
    return friends;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    const token = localStorage.getItem('token');
    form.append('body', state.caption);
    form.append('tag', state.gym);
    if (media) {
      form.append('file', media);
    }
    if (token) {
      editPost(form, { token: token, slug: post.slug })
        .then((data) => {
          dispatch(
            editPostAction({
              post: data,
              slug: data.slug,
              date: data.createdAt,
            })
          );
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="EditPostComponent" data-testid="EditPostComponent">
      <Modal
        className="modal"
        open={editModal}
        onClose={() => setEditModal(false)}
      >
        <Card className="modalCard">
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
            spacing={2}
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
                        options={gyms}
                        getOptionLabel={(option) => option}
                        fullWidth
                        onChange={handleAutoCompleteChange('gym')}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Gym"
                            variant="standard"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="text"
                      disabled={state.gym === ''}
                      onClick={handleClickOpen}
                    >
                      Tag Route
                    </Button>
                    <Dialog
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="form-dialog-title"
                    >
                      <DialogTitle id="form-dialog-title">
                        Tag Route
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Tag your routes here
                        </DialogContentText>
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
                        options={getFriends().map((option) => option.username)}
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
                  <Grid item xs={12}>
                    <Button
                      variant="text"
                      color="primary"
                      type="submit"
                      fullWidth
                    >
                      Edit
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Card>
      </Modal>
    </div>
  );
};

export default EditPostModal;
