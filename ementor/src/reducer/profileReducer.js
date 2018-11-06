import {
  GET_PROFILE,
  CLEAR_CURRENT_PROFILE,
  PROFILE_LOADING,
  GET_PROFILES
} from "../actions/types";

const initialState = {
  profile: null,
  profiles: null,

  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false
      };

    case PROFILE_LOADING:
      return {
        ...state,
        profile: action.payload,
        loading: true
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: action.payload,
        loading: false
      };

    case CLEAR_CURRENT_PROFILE:
      return {
        ...state,
        profile: null
      };

    default:
      return state;
  }
}
