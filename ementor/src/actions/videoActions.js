import axios from "axios";

import {
  GET_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  GET_PROFILES
} from "./types";

export const rateProfile = (vote, username, history) => dispatch => {
  axios
    .post(`/profile/${username}/vote`, vote)
    .then(res => history.push(`/profile/${username}`))
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};
