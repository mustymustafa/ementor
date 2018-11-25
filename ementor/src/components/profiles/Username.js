import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../common/spinner/Spinner";
import axios from "axios";


import DashboardHeader from "../dashboard/DashboardHeader";
import DashboardBody from "../dashboard/DashboardBody";
import {
  getProfileByUsername,
  bookSession,
  cancelSession
} from "../../actions/profileActions";

class Username extends Component {
  constructor(props) {
    super();
    this.state = {
      message: " "
    };
  }

  contactChange = e => {
    this.setState({ message: e.target.value });
  };

  contact = e => {
    e.preventDefault();

    const data = {
      message: this.state.message
    };

    axios.post(`/profile/${this.props.match.params.username}/contact`, data);
  };
  //book a time
  onBook(username, bookId) {
    this.props.bookSession(this.props.match.params.username, bookId);
  }

  //check if time is already booked
  findBookedUser(userIds) {
    const { auth } = this.props.auth;
    if (userIds.filter(userId => userId.user.id === auth.user.id).length > 0) {
      return true;
    }
    return false;
  }

  //cancel a booking

  onCancel(username, bookId) {
    this.props.cancelSession(this.props.match.params.username, bookId);
  }

  componentDidMount() {
    if (this.props.match.params.username) {
      this.props.getProfileByUsername(this.props.match.params.username);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile.profile === null && this.props.profile.loading) {
      this.props.history.push("/not-found");
    }
  }

  render() {
    const { loading, profile } = this.props.profile;
    const { auth } = this.props.auth;

    let profileContent;
    if (profile === null || loading) {
      profileContent = <Spinner />;
    } else {
          profileContent = (
            <div>
              <div className="profile">
                <div className="container">
                  <div className="row">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-6">
                      <Link
                        to="/profiles"
                        className="btn btn-light mb-3 float-left"
                      >
                        Back to profiles
                      </Link>
                    </div>

                    <div className="col-6">
                      <button
                        className="btn-lg float-right mb-3"
                        type="button"
                        onClick={this.contact}
                        style={{
                          backgroundColor: "rgba(72, 17, 42)",
                          color: "white",
                          border: "none"
                        }}
                        data-toggle="modal"
                        data-target="#myContact"
                      >
                        Contact Tutor <br />
                        <i className="fas fa-envelope" />
                      </button>

                      <div class="modal fade" id="myContact" role="dialog">
                        <div class="modal-dialog modal-sm">
                          <div class="modal-content">
                            <div class="modal-header">
                              <button
                                type="button"
                                class="close"
                                data-dismiss="modal"
                              >
                                &times;
                              </button>
                            </div>
                            <div class="modal-body">
                              <form onSubmit={this.contact}>
                                message:
                                <input
                                  type="text"
                                  onChange={this.contactChange}
                                />
                                <div class="modal-footer">
                                  <button
                                    type="submit"
                                    className="btn btn-default"
                                  >
                                    send
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <DashboardHeader profile={profile} />
                  <DashboardBody profile={profile} />
                </div>

                <div className="row">
                  <div className="col-12">
                    <h4>Available Times</h4>
                    <ul className="list-group" style={{ width: "290px" }}>
                      {profile.availablehours.map((ah, index) => (
                        <li key={index} className="list-group-item">
                          {ah.time}

                          {ah.user !== null ? (
                            <button
                              style={{ marginLeft: "5px" }}
                              onClick={this.onBook.bind(
                                this,
                                profile.username,
                                ah._id
                              )}
                              className="btn btn-primary btn-s"
                              type="button"
                              disabled
                            >
                              booked
                            </button>
                          ) : (
                            <button
                              style={{ marginLeft: "5px" }}
                              onClick={this.onBook.bind(
                                this,
                                profile.username,
                                ah._id
                              )}
                              className="btn btn-primary btn-s"
                              type="button"
                            >
                              Book
                            </button>
                          )}

                          <button
                            className="btn btn-danger btn-s float-right"
                            onClick={this.onCancel.bind(
                              this,
                              profile.username,
                              ah._id
                            )}
                          >
                            Cancel
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Profile</h1>
              {profileContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Username.propTypes = {
  getProfileByUsername: PropTypes.func.isRequired,
  bookSession: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { getProfileByUsername, bookSession, cancelSession }
)(Username);
