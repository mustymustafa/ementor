import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../../components/common/spinner/Spinner";
import { getSitcProfiles } from "../../actions/profileActions";
import ProfileItems from "./ProfileItems";

class Profiles extends Component {
  componentDidMount() {
    this.props.getSitcProfiles();
  }
  render() {
    const { profiles, loading } = this.props.profile;
    let profileItems;

    if (profiles === null || loading) {
      profileItems = <Spinner />;
    } else {
      if (profiles.length > 0) {
        profileItems = profiles.map(profile => (
          <ProfileItems key={profile._id} profile={profile} />
        ));
      } else {
        profileItems = <h4>No profile found</h4>;
      }
    }

    return (
      <div>
        <div className="profiles">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h1 className="display-4 text-center">Tutor Profiles</h1>
                <p className="lead text-center">
                  Browse and connect with Tutors
                </p>
                <a href="/profiles">
                  {" "}
                  <button className="tablink">SITC</button>
                </a>

                <a href="/sasprofiles">
                  {" "}
                  <button className="tablink">SAS</button>
                </a>

                <a href="/sbeprofiles">
                  {" "}
                  <button className="tablink">SBE</button>
                </a>
                <a href="/solprofiles">
                  {" "}
                  <button className="tablink">SOL</button>
                </a>
                {profileItems}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profiles.propTypes = {
  getSitcProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getSitcProfiles }
)(Profiles);
