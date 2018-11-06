import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import profileReducer from "./profileReducer";
import postReducer from "./postReducer";
import commentReducer from "./commentReducer";
import roomReducer from "./room-reducer";
import videoReducer from "./video-reducer";
import audioReducer from "./audio-reducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  profile: profileReducer,
  post: postReducer,
  comment: commentReducer,
  audio: audioReducer,
  room: roomReducer,
  video: videoReducer
});
