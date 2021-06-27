import './DeleteModal.scss';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Modal,
} from '@material-ui/core';
import { Post, User } from '../../interface/Schemas';
import React, { ReactNode, useEffect, useState } from 'react';
import { deletePost, fetchPost, likePost } from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import CommentComponent from '../CommentComponent/CommentComponent';
import Image from './../../static/placeholder.png';
import { removePost } from '../Redux/postSlice';

interface Props {
  slug: string;
  setDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  deleteConfirm: boolean;
  post: undefined | Post;
}

const DeleteModal: React.FC<Props> = ({
  slug,
  setDeleteConfirm,
  deleteConfirm,
  post,
}) => {
  const history = useHistory();

  const handleDelete = () => {
    const token = localStorage.getItem('token');
    if (token && post) {
      deletePost({ token: token, slug: slug }).then((data) => {
        removePost({ slug: post.slug, date: post.createdAt });
        setDeleteConfirm(false);
        history.push('/home');
      });
    }
  };

  return (
    <div>
      <Modal
        className="modal"
        open={deleteConfirm}
        onClose={() => {
          setDeleteConfirm(false);
        }}
      >
        <div>
          <Card className="modalCard">
            Are you sure you want to delete this?
            <CardActions className="modalActions">
              <Button onClick={handleDelete}>Yes</Button>
              <Button>No</Button>
            </CardActions>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

export default DeleteModal;
