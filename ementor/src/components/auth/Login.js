import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  };

  componentWillReceiveProps(nextProps) {
    const { user } = this.props.auth;

    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/posts");
    }

    if (nextProps.auth.isAuthenticated && nextProps.auth.user.isTutor) {
      this.props.history.push("/profile");
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  render() {
    const { errors } = this.state;
    const { user } = this.props.auth;
    return (
      <div className="login-clean">
        <form onSubmit={this.onSubmit}>
          <h2 className="sr-only">Login Form</h2>
          <div className="illustration">
            <i className="fas fa-sign-in-alt" style={{ color: "#5699e2" }} />
          </div>
          <div className="form-group">
            <input
              placeholder="email@aun.edu.ng"
              type="email"
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.email
              })}
              name="email"
              value={user.email}
              onChange={this.onChange}
              pattern="^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(aun)\.edu\.ng$"
              title="please enter an aun email"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.password
              })}
              placeholder="Password"
              name="password"
              value={user.password}
              onChange={this.onChange}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          <div className="form-group">
            <button
              style={{ backgroundColor: "#5699e2" }}
              className="btn btn-primary btn-block"
              type="submit"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
