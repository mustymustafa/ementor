import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import { withRouter } from "react-router-dom";

class Register extends Component {
  //define initial state of a component
  constructor() {
    super();
    this.state = {
      fn: "",
      email: "",
      school: "",
      password: "",
      errors: {}
    };
  }

  //get the fields

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const newUser = {
      fn: this.state.fn,
      email: this.state.email,
      school: this.state.school,
      password: this.state.password
    };

    this.props.registerUser(newUser, this.props.history);
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/home");
    }
  }

  //compare errors in component state and the errors from error reducer
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  render() {
    const { errors } = this.state;

    // const { user } = this.props.auth;

    return (
      <div className="register">
        <form onSubmit={this.onSubmit} style={{ color: "white" }}>
          <div class="illustration">
            <p style={{ fontSize: "25px", color: "white" }}>
              Create your eMentor account
            </p>
          </div>
          <div className="form-group">
            <input
              type="text"
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.fn
              })}
              placeholder="Name"
              name="fn"
              value={this.state.fn}
              onChange={this.onChange}
            />

            {errors.fn && <div className="invalid-feedback">{errors.fn}</div>}
          </div>
          <div className="form-group">
            <input
              type="email"
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.email
              })}
              placeholder="Email Address"
              name="email"
              value={this.state.email}
              onChange={this.onChange}
            />

            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          <div className="form-group">
            <select
              required
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.school
              })}
              name="school"
              onChange={this.onChange}
              value={this.state.school}
            >
              <option label="*Select your School" disabled />
              <option value="SITC">SITC</option>
              <option value="SAS">SAS</option>
              <option value="SBE">SBE</option>
              <option value="SOL">SOL</option>
            </select>
            {errors.school && (
              <div className="invalid-feedback">{errors.school}</div>
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
              value={this.state.password}
              onChange={this.onChange}
            />

            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>
          <div className="form-group">
            <button
              className="btn  btn-block"
              type="submit"
              style={{ backgroundColor: "#5699e2", color: "white" }}
            >
              Sign Up
            </button>
          </div>
          <p style={{ fontSize: "12px", textAlign: "center" }}>
            {" "}
            or login with:
          </p>
          <a href="#">
            <button
              style={{ backgroundColor: "red", color: "white", padding: "5px" }}
              className="btn  btn-block"
              type="submit"
            >
              Log In with <i className="fab fa-google" />
            </button>
          </a>
        </form>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

//to get any of the auth state
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
