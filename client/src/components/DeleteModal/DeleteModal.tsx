import './DeleteModal.scss';

import { Button, Card, CardActions, Modal } from '@material-ui/core';
import { Comment, Post } from '../../interface/Schemas';
import { deleteComment, deletePost } from '../../api';

import React from 'react';
import { removePost } from '../Redux/postSlice';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

interface Props {
  slug: string;
  setDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  setPost?: React.Dispatch<React.SetStateAction<Post | undefined>>;
  deleteConfirm: boolean;
  post?: Post;
  comment?: Comment;
  type: 'comment' | 'post';
}

const DeleteModal: React.FC<Props> = ({
  slug,
  setDeleteConfirm,
  setPost,
  deleteConfirm,
  post,
  comment,
  type,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const handleDelete = () => {
    const token = localStorage.getItem('token');
    if (token && type === 'post' && post) {
      deletePost({ token: token, slug: slug }).then((data) => {
        dispatch(removePost({ slug: post.slug, date: post.createdAt }));
        setDeleteConfirm(false);
        history.push('/home');
      });
    }

    if (token && type === 'comment' && comment) {
      deleteComment({ id: comment._id, token: token, slug: slug }).then(() => {
        setDeleteConfirm(false);
        if (post && setPost) {
          const comments = post.comments;
          const filtered = comments.filter((cmt) => cmt._id !== comment._id);
          setPost({ ...post, comments: filtered });
        }
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
              <Button onClick={() => setDeleteConfirm(false)}>No</Button>
            </CardActions>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

export default DeleteModal;
