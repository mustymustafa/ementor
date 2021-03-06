import axios from "axios";

import {
  GET_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  GET_PROFILES
} from "./types";
import { logoutUser } from "./authActions";

//get current profile

export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile")
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};

//get PROFILES

export const getSitcProfiles = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile/sitc")
    .then(res =>
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILES,
        payload: null
      })
    );
};

export const getSasProfiles = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile/sas")
    .then(res =>
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILES,
        payload: null
      })
    );
};

export const getSbeProfiles = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile/sbe")
    .then(res =>
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILES,
        payload: null
      })
    );
};

export const getSolProfiles = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile/sol")
    .then(res =>
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILES,
        payload: null
      })
    );
};

// Get profile by username
export const getProfileByUsername = username => dispatch => {
  axios
    .get(`/api/profile/${username}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: null
      })
    );
};

// Create Profile
export const createProfile = (profileData, history) => dispatch => {
  axios
    .post("/api/profile", profileData)
    .then(logoutUser())

    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//book a session

export const bookSession = (username, bookId) => dispatch => {
  axios
    .get(`/api/profile/${username}/book/${bookId}`)
    .then(res => dispatch(window.location.reload()))
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: null
      })
    );
};

//cancel a booking

export const cancelSession = (username, bookId) => dispatch => {
  axios
    .get(`/api/profile/${username}/cancel/${bookId}`)
    .then(res => dispatch(window.location.reload()))
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: null
      })
    );
};

// Profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};
