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
        {user.isTutor ? (
          <li style={{ display: "none" }} className="nav-item ">
            <a className="nav-link" href="/profile">
              BECOME A TUTOR
            </a>
          </li>
        ) : (
          <li className="nav-item">
            <a className="nav-link" href="/profile">
              BECOME A TUTOR
            </a>
          </li>
        )}

        <li className="nav-item ">
          <a className="nav-link" href="/posts">
            Posts
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="/profiles">
            Tutors
          </a>
        </li>

        {user.isTutor ? (
          <li className="nav-item">
            <a className="nav-link" href="/profile">
              Profile
            </a>
          </li>
        ) : (
          <li style={{ display: "none" }} className="nav-item">
            <a className="nav-link" href="/profiles">
              Tutors
            </a>
          </li>
        )}

        <li className="nav-item">
          <a
            href="#"
            onClick={this.onLogoutClick.bind(this)}
            className="nav-link"
          >
            Log Out <i className="fas fa-sign-out-alt" />
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
          <Link className="nav-link" to="/login">
            LOGIN
          </Link>
        </li>
      </ul>
    );

    return (
      <nav className="navbar sticky-top navbar-light navbar-expand-md navigation-clean-button mb4">
        <div className="container">
          <a className="navbar-brand" href="/">
            eMentor
          </a>
          <button
            className="navbar-toggler"
            data-toggle="collapse"
            data-target="#navcol-1"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navcol-1">
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
