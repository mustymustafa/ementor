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
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <p className="lead text-center">
                <h1>Create your eMentor account</h1>
              </p>

              <form onSubmit={this.onSubmit}>
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

                  {errors.fn && (
                    <div className="invalid-feedback">{errors.fn}</div>
                  )}
                </div>

                <div className="form-group">
                  <select
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.school
                    })}
                    name="school"
                    onChange={this.onChange}
                    value={this.state.school}
                  >
                    <option value="0">* Select Your School</option>
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
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
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
