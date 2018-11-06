import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import Spinner from "../../components/common/spinner/Spinner";
import { getPost, getComments } from "../../actions/postActions";
import PostItem from "../posts/PostItem";
import CommentForm from "./CommentForm";
import CommentFeed from "./CommentFeed";

class Post extends Component {
  componentDidMount() {
    //getPost takes id as a parameter
    //get the id from params

    this.props.getPost(this.props.match.params.id);
    this.props.getComments(this.props.match.params.id);
  }

  render() {
    const { post, loading } = this.props.post;
    const { comments } = this.props.comment;
    let postContent;

    if (post === null || loading || Object.keys(post).length === 0) {
      postContent = <Spinner />;
    } else {
      postContent = (
        <div>
          <PostItem post={post} showActions={false} />
          <CommentForm postId={post._id} />
          <CommentFeed postId={post._id} />
        </div>
      );
    }

    return (
      <div className="post">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Link to="/posts" className="btn btn-light mb-3">
                Back To Feed
              </Link>
              {postContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  getComments: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  comment: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post,
  comment: state.comment
});
export default connect(
  mapStateToProps,
  { getPost, getComments }
)(Post);
