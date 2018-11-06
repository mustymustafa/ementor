import React, { Component } from "react";
import PropTypes from "prop-types";
import CommentItem from "./CommentItem";
import { connect } from "react-redux";

class CommentFeed extends Component {
  render() {
    const { comments } = this.props.comments;
    const { postId } = this.props;

    return comments.map(comment => (
      <CommentItem key={comment._id} comment={comment} postId={postId} />
    ));
  }
}

CommentFeed.propTypes = {
  comments: PropTypes.array.isRequired,
  postId: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  comments: state.comment
});

export default connect(mapStateToProps)(CommentFeed);
