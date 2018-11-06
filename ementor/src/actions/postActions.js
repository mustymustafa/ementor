import axios from "axios";
import {
  ADD_POST,
  GET_POSTS,
  GET_ERRORS,
  CLEAR_ERRORS,
  POST_LOADING,
  DELETE_POST,
  GET_COMMENT,
  ADD_COMMENT,
  GET_COMMENTS,
  DELETE_COMMENT,
  COMMENT_LOADING,
  GET_POST
} from "../actions/types";

export const addPost = postData => dispatch => {
  dispatch(clearErrors());
  axios
    .post("/post", postData)
    .then(res =>
      dispatch({
        type: ADD_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//GET POSTS
export const getPosts = () => dispatch => {
  dispatch(Postloading());
  axios
    .get("/post")
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
};

//get single post and comments

export const getPost = id => dispatch => {
  dispatch(Postloading());

  axios
    .get(`/post/${id}`)
    .then(res =>
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POST,
        payload: null
      })
    );
};

// Delete Post
export const deletePost = id => dispatch => {
  axios
    .delete(`/post/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_POST,
        payload: id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//get Comments
export const getComments = id => dispatch => {
  dispatch(Commentloading());
  axios
    .get(`/post/${id}/comment`)
    .then(res =>
      dispatch({
        type: GET_COMMENTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POST,
        payload: null
      })
    );
};

//add comment

export const addComment = (postId, commentData) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/post/${postId}/comment`, commentData)
    .then(res =>
      dispatch(window.location.reload(), {
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete Comment
export const deleteComment = (postId, commentId) => dispatch => {
  axios
    .delete(`/post/${postId}/comment/${commentId}/delete`)
    .then(res =>
      dispatch(window.location.reload(), {
        type: DELETE_COMMENT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//ADD LIKE

export const addLike = (postId, commentId) => dispatch => {
  axios
    .post(`/post/${postId}/comment/${commentId}/like`)
    .then(res => dispatch(window.location.reload()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Remove LIKE

export const removeLike = (postId, commentId) => dispatch => {
  axios
    .post(`/post/${postId}/comment/${commentId}/unlike`)
    .then(res => dispatch(window.location.reload()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

//set loading state
export const Postloading = () => {
  return {
    type: POST_LOADING
  };
};

//comment loading
export const Commentloading = () => {
  return {
    type: COMMENT_LOADING
  };
};
