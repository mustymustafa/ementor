import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

//register user
export const registerUser = (userData, history) => dispatch => {
  const data = {
    email: userData.email,
    password: userData.password
  };
  axios({
    method: "post",
    url: "/api/register",
    data: userData
  })
    .then(res => history.push("/login"), loginUser(data))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
//login User - GET USER TOKEN
export const loginUser = userData => dispatch => {
  axios({
    method: "post",
    url: "/api/login",
    data: userData
  })
    .then(res => {
      //save the token to local storage
      const { token } = res.data;
      //set token to ls
      localStorage.setItem("jwtToken", token);
      //set it to auth header
      setAuthToken(token);
      //decode token to get user data
      const decoded = jwt_decode(token);
      //set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//set logged in user

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

//log user out
export const logoutUser = () => dispatch => {
  //remobe token from local storage
  localStorage.removeItem("jwtToken");
  //remove auth header for future request
  setAuthToken(false);
  //set current user to {} which auth will be false
  dispatch(setCurrentUser({}));
};
