import {
  ADD_COMMENT,
  GET_COMMENT,
  GET_COMMENTS,
  COMMENT_LOADING,
  DELETE_COMMENT
} from "../actions/types";

const initialState = {
  comments: [],
  comment: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case COMMENT_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_COMMENTS:
      return {
        ...state,
        comments: action.payload,
        loading: false
      };
    case GET_COMMENT:
      return {
        ...state,
        comment: action.payload,
        loading: false
      };
    case ADD_COMMENT:
      return {
        ...state,
        comments: [action.payload, ...state.comments]
      };
    case DELETE_COMMENT:
      return {
        ...state,
        comments: state.comments.filter(
          comment => comment._id !== action.payload
        )
      };

    default:
      return state;
  }
}
