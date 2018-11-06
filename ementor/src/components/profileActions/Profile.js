// edit profile, delete account and all profile(dashboard settings)

import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { createProfile, getCurrentProfile } from "../../actions/profileActions";
import classnames from "classnames";
import isEmpty from "../../validation/is-empty";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySocialInputs: false,
      username: "",
      office: "",
      availablehours: "",
      school: "",
      status: "",
      skills: "",
      bio: "",
      twitter: "",
      facebook: "",
      linkedin: "",
      youtube: "",
      errors: {}
    };
  }

  componentDidMount() {
    this.props.getCurrentProfile();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.profile.profile) {
      const profile = nextProps.profile.profile;
      // Bring skills array back to CSV
      const skillCSV = profile.skills.join(",");

      // If profile field doesnt exist, make empty string
      profile.office = !isEmpty(profile.office) ? profile.office : "";
      profile.availablehours = !isEmpty(profile.availablehours)
        ? profile.availablehours
        : "";
      profile.status = !isEmpty(profile.status) ? profile.status : "";
      profile.school = !isEmpty(profile.school) ? profile.school : "";
      profile.bio = !isEmpty(profile.bio) ? profile.bio : "";
      profile.social = !isEmpty(profile.social) ? profile.social : {};
      profile.twitter = !isEmpty(profile.social.twitter)
        ? profile.social.twitter
        : "";
      profile.facebook = !isEmpty(profile.social.facebook)
        ? profile.social.facebook
        : "";
      profile.linkedin = !isEmpty(profile.social.linkedin)
        ? profile.social.linkedin
        : "";
      profile.youtube = !isEmpty(profile.social.youtube)
        ? profile.social.youtube
        : "";

      //set component field states
      this.setState({
        username: profile.username,

        office: profile.office,
        status: profile.status,
        skills: skillCSV,
        school: profile.school,
        availablehours: profile.availablehours,
        bio: profile.bio,
        twitter: profile.social.twitter,
        facebook: profile.social.facebook,
        linkedin: profile.social.linkedin,
        youtube: profile.social.youtube
      });
    }
  }

  onSubmit = e => {
    e.preventDefault();

    const profileData = {
      username: this.state.username,

      office: this.state.office,
      status: this.state.status,
      skills: this.state.skills,
      school: this.state.school,
      availablehours: this.state.availablehours,
      bio: this.state.bio,
      twitter: this.state.twitter,
      facebook: this.state.facebook,
      linkedin: this.state.linkedin,
      youtube: this.state.youtube
    };

    this.props.createProfile(profileData, this.props.history);
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { displaySocialInputs } = this.state;
    const { errors } = this.state;

    let socialInputs;

    if (displaySocialInputs) {
      socialInputs = (
        <div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fab fa-twitter" />
              </span>
            </div>
            <input
              type="text"
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.twitter
              })}
              placeholder="Twitter Profile URL"
              name="twitter"
              value={this.state.twitter}
              onChange={this.onChange}
            />
            {errors.twitter && (
              <div className="invalid-feedback">{errors.twitter}</div>
            )}
          </div>

          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fab fa-facebook" />
              </span>
            </div>
            <input
              type="text"
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.facebook
              })}
              placeholder="Facebook Page URL"
              name="facebook"
              value={this.state.facebook}
              onChange={this.onChange}
            />
            {errors.facebook && (
              <div className="invalid-feedback">{errors.facebook}</div>
            )}
          </div>

          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fab fa-linkedin" />
              </span>
            </div>
            <input
              type="text"
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.linkedin
              })}
              placeholder="Linkedin Profile URL"
              name="linkedin"
              value={this.state.linkedin}
              onChange={this.onChange}
            />
            {errors.linkedin && (
              <div className="invalid-feedback">{errors.linkedin}</div>
            )}
          </div>

          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fab fa-youtube" />
              </span>
            </div>
            <input
              type="text"
              className={classnames("form-control form-control-lg", {
                "is-invalid": errors.youtube
              })}
              placeholder="YouTube Channel URL"
              name="youtube"
              value={this.state.youtube}
              onChange={this.onChange}
            />
          </div>
          {errors.youtube && (
            <div className="invalid-feedback">{errors.youtube}</div>
          )}
        </div>
      );
    }

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/profile" className="btn btn-light">
                Go Back
              </Link>

              <h1 className="display-4 text-center">Update Your Profile</h1>
              <p className="lead text-center">
                Let's get some information to make your profile stand out
              </p>
              <small className="d-block pb-3">* = required field</small>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.username
                    })}
                    placeholder="* Profile Username"
                    name="username"
                    value={this.state.username}
                    onChange={this.onChange}
                  />

                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>

                <div className="form-group">
                  <select
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.status
                    })}
                    name="status"
                    onChange={this.onChange}
                    value={this.state.status}
                  >
                    <option value="0">* Select Professional Status</option>
                    <option value="Student">Student</option>
                    <option value="Instructor">Instructor or Teacher</option>
                  </select>
                  <small className="form-text text-muted">
                    Give us an idea of where you are at in your career
                  </small>

                  {errors.status && (
                    <div className="invalid-feedback">{errors.status}</div>
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
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Office Location"
                    name="office"
                    onChange={this.onChange}
                    value={this.state.office}
                  />
                  <small className="form-text text-muted">
                    Your Office Location e.g AS 101, HS OR BB 102 (OPTIONAL)
                  </small>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.availablehours
                    })}
                    placeholder="10am to 12pm"
                    name="availablehours"
                    onChange={this.onChange}
                    value={this.state.availablehours}
                  />

                  <small className="form-text text-muted">
                    Any convenient time you would be available for Tutoring
                    Sessions (PLEASE USE THE FORMAT IN THE PLACEHOLDER)
                  </small>

                  {errors.availablehours && (
                    <div className="invalid-feedback">
                      {errors.availablehours}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.skills
                    })}
                    placeholder="Skills"
                    name="skills"
                    value={this.state.skills}
                    onChange={this.onChange}
                  />
                  <small className="form-text text-muted">
                    <b>*Please use comma separated values</b> (eg. JAVASCRIPPT,
                    PHP, CIE, CALCULUS, CSC, SEN, ACC )
                  </small>
                  {errors.skills && (
                    <div className="invalid-feedback">{errors.skills}</div>
                  )}
                </div>

                <div className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    placeholder="A short bio of yourself"
                    name="bio"
                    value={this.state.bio}
                    onChange={this.onChange}
                  />
                  <small className="form-text text-muted">
                    Tell us a little about yourself
                  </small>
                </div>

                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      this.setState(prevState => ({
                        displaySocialInputs: !prevState.displaySocialInputs
                      }));
                    }}
                    className="btn btn-light"
                  >
                    Add Social Network Links
                  </button>
                  <span className="text-muted">Optional</span>
                </div>
                {socialInputs}

                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createProfile, getCurrentProfile }
)(withRouter(Profile));
