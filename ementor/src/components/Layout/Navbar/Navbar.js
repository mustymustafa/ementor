import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../../actions/authActions";

class Navbar extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
  }
  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authUserLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item ">
          <Link className="nav-link" to="/posts">
            Posts
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/profiles">
            Tutors
          </Link>
        </li>

        {user.isTutor ? (
          <li className="nav-item">
            <Link className="nav-link" to="/profile">
              Profile
            </Link>
          </li>
        ) : (
          <li style={{ display: "none" }} className="nav-item">
            <Link className="nav-link" to="/profiles">
              Tutors
            </Link>
          </li>
        )}

        <li className="nav-item">
          <a
            href="#"
            onClick={this.onLogoutClick.bind(this)}
            className="nav-link"
          >
            Log Out <i className="icon ion-log-out" />
          </a>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            SIGN UP
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/registerT">
            BECOME A TUTOR
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/login">
            LOGIN
          </Link>
        </li>
      </ul>
    );

    return (
      <nav className="navbar sticky-top navbar-expand navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">
            eMentor
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item" />
            </ul>

            {isAuthenticated ? authUserLinks : guestLinks}
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);
