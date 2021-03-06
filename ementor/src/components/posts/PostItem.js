import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Link } from "react-router-dom";
import { deletePost } from "../../actions/postActions";
import pp from "../../img/pp.png";

class PostItem extends Component {
  onDeleteClick = id => {
    this.props.deletePost(id);
  };
  render() {
    const { post, auth, showActions } = this.props;

    return (
      <div className="post">
        <div className="card card-body mb-3">
          <div className="row">
            <div className="col-md-2">
              <a href="profile.html">
                <img
                  className="rounded-circle"
                  src={pp}
                  style={{ height: 100, width: 100 }}
                  alt=""
                />
              </a>
              <br />
              <p>
                posted by:
                {post.user.fn}
              </p>

              <p>category:{post.category}</p>
            </div>

            <div className="col-md-10">
              <div dangerouslySetInnerHTML={{ __html: post.text }} />

              <Link to={`/post/${post._id}`} className="btn btn-info mr-1">
                Reply
              </Link>
              {post.user.id === auth.user.id ? (
                <button
                  onClick={this.onDeleteClick.bind(this, post._id)}
                  type="button"
                  className="btn btn-danger mr-1"
                >
                  <i className="fas fa-times" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deletePost }
)(PostItem);
