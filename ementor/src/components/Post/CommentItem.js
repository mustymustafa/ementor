import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { deleteComment, addLike, removeLike } from "../../actions/postActions";

class CommentItem extends Component {
  onDeleteClick(postId, commentId) {
    this.props.deleteComment(postId, commentId);
  }

  onLikeClick(postId, commentId) {
    this.props.addLike(postId, commentId);
  }

  onUnlikeClick(postId, commentId) {
    this.props.removeLike(postId, commentId);
  }

  findUserLike(likes) {
    const { auth } = this.props;
    if (likes.filter(like => like.user._id === auth.user.id).length > 0) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { comment, postId, auth, showActions } = this.props;
    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-3">
            <a href="profile.html">
              <img
                className="rounded-circle"
                src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200"
                style={{ height: 100, width: 100 }}
                alt=""
              />
            </a>
            <br />
            <p>
              answered by:
              {comment.user.fn}
            </p>
          </div>
          <div className="col-md-9">
            <div dangerouslySetInnerHTML={{ __html: comment.text }} />
            <button
              onClick={this.onLikeClick.bind(this, postId, comment._id)}
              type="button"
              className="btn btn-light mr-1"
            >
              <i
                className={classnames("fas fa-thumbs-up", {
                  "text-info": this.findUserLike(comment.likes)
                })}
              />
              <span className="badge badge-light">{comment.likes.length}</span>
            </button>

            <button
              onClick={this.onUnlikeClick.bind(this, postId, comment._id)}
              type="button"
              className="btn btn-light mr-1"
            >
              <i className="text-secondary fas fa-thumbs-down" />
            </button>
            {comment.user.id === auth.user.id ? (
              <button
                onClick={this.onDeleteClick.bind(this, postId, comment._id)}
                type="button"
                className="btn btn-danger mr-1"
              >
                <i className="fas fa-times" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

CommentItem.defaultProps = {
  showActions: true
};

CommentItem.propTypes = {
  deleteComment: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { deleteComment, addLike, removeLike }
)(CommentItem);
