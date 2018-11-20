import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addPost } from "../../actions/postActions";
import classnames from "classnames";
import Editor from "../Editor";

class Postform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      category: "",
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = html => {
    this.setState({ text: html });
  };

  

  onCategory = e => {
    this.setState({ category: e.target.value });
  };
  onSubmit = e => {
    const { user } = this.props.auth;
    e.preventDefault();

    const newPost = {
      text: this.state.text,
      name: user.fn,
      category: this.state.category
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
              Ask a Quesion...
            </div>
            <div className="card-body">
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <Editor
                    id="editor"
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
                <div className="row">
                  <div className="col-6">
                    <button
                      type="submit"
                      className="btn btn-dark mb-3 float-left"
                    >
                      Submit
                    </button>
                  </div>

                  <div className="col-6">
                    <select
                      required
                      style={selectStyle}
                      className="form-control float-right"
                      id="category"
                      onChange={this.onCategory}
                      value={this.state.category}
                    >
                      <option label="*Select a category*" disabled />
                      <option>SITC</option>
                      <option>SBE</option>
                      <option>SOL</option>
                      <option>SAS</option>
                    </select>
                  </div>
                  {errors.category && (
                    <div className="invalid-feedback">{errors.category}</div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const selectStyle = {
  width: "190px"
};

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
