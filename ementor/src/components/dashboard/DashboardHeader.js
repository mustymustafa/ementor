import React, { Component } from "react";
import isEmpty from "../../validation/is-empty";

class DashboardHeader extends Component {
  render() {
    const { profile } = this.props;

    return (
      <div className="row">
        <div className="col-md-12">
          <div
            className="card card-body  text-white mb-3"
            style={{ backgroundColor: "rgba(72, 17, 42)" }}
          >
            <div className="row">
              <div className="col-4 col-md-3 m-auto">
                <img
                  className="rounded-circle"
                  src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200"
                  alt=""
                />
              </div>
            </div>
            <div className="text-center">
              <h1 className="display-4 text-center">{profile.user.fn}</h1>
              <p>username: {profile.username}</p>
              <p>Status: {profile.status}</p>
              <p>School: {profile.school}</p>

              <p>
                {isEmpty(profile.office) ? null : (
                  <span>Office: {profile.office}</span>
                )}
              </p>

              <p>
                {isEmpty(profile.social && profile.social.twitter) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.social.twitter}
                    target="_blank"
                  >
                    <i className="fab fa-twitter fa-2x" />
                  </a>
                )}

                {isEmpty(profile.social && profile.social.facebook) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.social.facebook}
                    target="_blank"
                  >
                    <i className="fab fa-facebook fa-2x" />
                  </a>
                )}

                {isEmpty(profile.social && profile.social.youtube) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.social && profile.social.youtube}
                    target="_blank"
                  >
                    <i className="fab fa-youtube fa-2x" />
                  </a>
                )}

                {isEmpty(profile.social && profile.social.linkedin) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile.social.linkedin}
                    target="_blank"
                  >
                    <i className="fab fa-linkedin fa-2x" />
                  </a>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardHeader;
