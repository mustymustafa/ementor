import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import pp from "../../img/pp.png";

class ProfileItem extends Component {
  render() {
    const { profile } = this.props;

    return (
      <div className="card card-body bg-light mb-3">
        <div className="row">
          <div className="col-2">
            <img src={pp} alt="" className="rounded-circle" />
          </div>
          <div className="col-lg-6 col-md-4 col-8">
            <h3>{profile.user.fn}</h3>
            <p>{profile.status}</p>
            <p>{profile.school}</p>

            <p>
              rating{" "}
              <i
                className="icon ion-ios-star-outline"
                style={{ color: "gold", fontSize: "20px" }}
              />
              : {profile.rating}
            </p>
            <a href={`/profiles/${profile.username}`} className="btn btn-info">
              View Profile
            </a>
          </div>
          <div className="col-md-4 d-none d-md-block">
            <h4>Skill Set</h4>
            <ul className="list-group">
              {profile.skills.slice(0, 4).map((skill, index) => (
                <li key={index} className="list-group-item">
                  <i className="fa fa-check pr-1" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;
