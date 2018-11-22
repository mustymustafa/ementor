import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profileActions";
import Spinner from "../common/spinner/Spinner";
import isEmpty from "../../is-empty";
import DashboardHeader from "./DashboardHeader";
import { addPost } from "../../actions/postActions";
import classnames from "classnames";
import axios from "axios";
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invite: " ",
      link: "",
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

  onInviteChange = e => {
    this.setState({ invite: e.target.value });
  };

  onInvite = e => {
    e.preventDefault();

    const data = {
      invite: this.state.invite,
      link: this.state.link
    };

    axios.post("/profile/invite", data);
    window.location.assign(`/${this.state.link}`);
  };

  componentDidMount() {
    this.props.getCurrentProfile();
  }

  render() {
    const { errors } = this.state;
    const { user } = this.props.auth;
    const { loading, profile } = this.props.profile;

    this.state.link = `session/${user.id}`;

    const firstname = user.fn.trim().split(" ")[0];
    let dashboardContent;

    if (profile === null || loading) {
      dashboardContent = <Spinner />;
    } else {
      // Check if logged in user has profile data
      if (Object.keys(profile).length > 0) {
        //this.props.history.push("/profile/" + profile.username);
        dashboardContent = (
          <div>
            <div className="profile">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-6">
                        <Link
                          to="/editprofile"
                          className="btn btn-light mb-3 float-left"
                        >
                          Edit Profile
                        </Link>
                      </div>
                      <div className="col-6">
                        <button
                          type="button"
                          class="btn btn-info btn-lg float-right"
                          data-toggle="modal"
                          data-target="#myModal"
                        >
                          Create Session
                        </button>

                        <div class="modal fade" id="myModal" role="dialog">
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
                                <form onSubmit={this.onInvite}>
                                  invite:{" "}
                                  <input
                                    type="email"
                                    onChange={this.onInviteChange}
                                  />
                                  <div class="modal-footer">
                                    <button
                                      type="submit"
                                      className="btn btn-default"
                                    >
                                      create
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

                    <div className="row">
                      <div className="col-md-12">
                        <div className="card card-body bg-light mb-3">
                          <h3 className="text-center text-info">
                            {firstname}
                            's Bio
                          </h3>

                          <p className="lead">
                            {isEmpty(profile.bio) ? (
                              <span>{firstname} does not have a bio</span>
                            ) : (
                              <span>{profile.bio}</span>
                            )}
                          </p>
                          <hr />
                          <h3 className="text-center text-info">Skill Set</h3>
                          <div className="row">
                            <div className="d-flex flex-wrap justify-content-center align-items-center">
                              {profile.skills.map((skill, index) => (
                                <div key={index} className="p-3">
                                  <i className="fa fa-check" /> {skill}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4 d-none d-md-block">
                        <h4>Available Times</h4>
                        <ul className="list-group">
                          {profile.availablehours.map((ah, index) => (
                            <li key={index} className="list-group-item">
                              {ah.time}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="col-md-6 ">
                        <div className="post-form mb-3">
                          <div className="card card-info">
                            <div className="card-header bg-info text-white">
                              Share Somthing...
                            </div>
                            <div className="card-body">
                              <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                  <textarea
                                    className={classnames(
                                      "form-control form-control-lg",
                                      {
                                        "is-invalid": errors.text
                                      }
                                    )}
                                    name="text"
                                    onChange={this.onChange}
                                    value={this.state.text}
                                  />
                                  {errors.text && (
                                    <div className="invalid-feedback">
                                      {errors.text}
                                    </div>
                                  )}
                                </div>
                                <button type="submit" className="btn btn-dark">
                                  Post
                                </button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        // User is logged in but has no profile
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.fn}</p>
            <p>You have not yet setup a profile, please add some info</p>
            <Link to="/createprofile" className="btn btn-lg btn-info">
              Create Profile
            </Link>
          </div>
        );
      }
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { getCurrentProfile, addPost }
)(Dashboard);
