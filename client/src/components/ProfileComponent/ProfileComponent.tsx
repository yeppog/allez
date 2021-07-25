import './ProfileComponent.scss';

import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Divider,
  Grid,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import { Post, PublicUser, User } from '../../interface/Schemas';
import React, { ReactNode, useEffect, useState } from 'react';
import {
  addFollow,
  fetchUserPost,
  fetchUserTagged,
  removeFollow,
} from '../../api';
import { useHistory, useParams } from 'react-router';

import Image from './../../static/404.png';
import PostComponent from '../PostComponent/PostComponent';
import SettingsIcon from '@material-ui/icons/Settings';
import axios from 'axios';
import { formatNumber } from '../../formatNumber';
import { useSelector } from 'react-redux';

interface ID {
  id: string;
}

interface State {
  myself: boolean;
  following: boolean;
  error: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      style={{ minWidth: '100%' }}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function tabProps(index: any) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const ProfileComponent: React.FC = (props) => {
  const history = useHistory();
  const username = useParams<ID>().id;
  const [tab, setTab] = useState(0);
  const [posts, setPosts] = useState<ReactNode>();
  const [taggedPosts, setTaggedPosts] = useState<ReactNode>();
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
    postCount: 0,
  });
  const [state, setState] = useState<State>({
    myself: false,
    following: false,
    error: false,
  });
  /** Fetch the specified user on load */
  useEffect(() => {
    if (loggedInUser.username === username) {
      setState({ ...state, myself: true, error: false });
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

              setState({
                ...state,
                following: true,
                myself: false,
                error: false,
              });
            }
          }
        })
        .catch((err) => {
          setState({ ...state, error: true });
          setUser({} as PublicUser);
        });
    }

    const token = localStorage.getItem('token');
    if (token) {
      fetchUserPost(token, username).then((data: Post[]) => {
        setPosts(
          data
            .filter((x) => x !== null)
            .map((posts) => (
              <div>
                <PostComponent post={posts} user={user as User} />
              </div>
            ))
        );
      });
      fetchUserTagged(token, username).then((data: Post[]) =>
        setTaggedPosts(
          data
            .filter((x) => x !== null)
            .map((posts) => (
              <div>
                <PostComponent post={posts} user={user as User} />
              </div>
            ))
        )
      );
    }
  }, [username, loggedInUser, history]);

  const handleFetchUser = (prop: keyof PublicUser, data: any) => {
    setState({ ...state, [prop]: data });
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
  };

  return (
    <div className="ProfileComponent" data-testid="ProfileComponent">
      {state.error ? (
        <div>
          <Typography variant="h3" style={{ textAlign: 'center' }}>
            {' '}
            Profile not found.
          </Typography>
        </div>
      ) : (
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
                <div className="imgContainer">
                  <Avatar
                    className="profilepic"
                    style={{
                      height: 150,
                      width: 150,
                      backgroundColor: 'white',
                    }}
                  >
                    <img
                      alt="avatar"
                      src={user.avatarPath ? user.avatarPath : Image}
                      className="profileImg"
                    />
                  </Avatar>
                </div>
              </Grid>
              <Grid item>
                <Grid
                  item
                  container
                  direction="column"
                  alignItems="stretch"
                  spacing={4}
                >
                  <Grid item container alignItems="center" spacing={4}>
                    <Grid item>
                      <Typography
                        variant="h5"
                        style={{ fontWeight: 600, marginLeft: 15 }}
                      >
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
                            <Typography>{user.postCount}</Typography>
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

          <Grid
            item
            container
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minWidth: '100%' }}
          >
            <Grid item style={{ justifyContent: 'center', paddingTop: '20px' }}>
              <Typography>Posts</Typography>
            </Grid>
            <Grid
              item
              style={{
                justifyContent: 'center',
                paddingTop: '20px',
              }}
            >
              <Tabs
                value={tab}
                onChange={(e: React.ChangeEvent<{}>, s: number) => setTab(s)}
              >
                <Tab label="Posts" {...tabProps(0)} />
                <Tab label="Tagged Posts" {...tabProps(1)} />
              </Tabs>
            </Grid>
            <TabPanel value={tab} index={0}>
              {posts}
            </TabPanel>
            <TabPanel value={tab} index={1}>
              {taggedPosts}
            </TabPanel>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default ProfileComponent;
