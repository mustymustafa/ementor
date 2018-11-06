import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addPost } from "../../actions/postActions";
import classnames from "classnames";

class Postform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      errors: {}
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    const { user } = this.props.auth;
    e.preventDefault();

    const newPost = {
      text: this.state.text,
      name: user.fn
      //avatar: user.avatar
    };

    this.props.addPost(newPost, this.props.history);
    this.setState({ text: " " });
  };

  render() {
    //bring in errors
    const { errors } = this.state;

    return (
      <div>
        <div className="post-form mb-3">
          <div className="card card-info">
            <div className="card-header bg-info text-white">
              Say Somthing...
            </div>
            <div className="card-body">
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <textarea
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.text
                    })}
                    placeholder="Ask a question"
                    name="text"
                    onChange={this.onChange}
                    value={this.state.text}
                  />
                  {errors.text && (
                    <div className="invalid-feedback">{errors.text}</div>
                  )}
                </div>
                <button type="submit" className="btn btn-dark">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Postform.propTypes = {
  addPost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addPost }
)(Postform);
