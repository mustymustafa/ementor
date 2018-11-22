import React, { Component } from "react";
import Background from "../../../img/showcase.jpg";
import Img1 from "../../../img/talking-vector-illustrator.png";
import Img2 from "../../../img/Tutoring.png";
import Img3 from "../../../img/video-chat.png";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";

var styles = {
  backgroundImage: `url(${Background})`
};
class Landing extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/posts");
    }

    if (this.props.auth.isTutor) {
      this.props.history.push("/profile");
    }
  }

  render() {
    return (
      <div>
        <section>
          <div className="landing" style={styles}>
            <div className="dark-overlay landing-inner text-light">
              <div className="container">
                <div className="row">
                  <div className="col-md-12 text-center">
                    <h1 className="display-3 mb-4">eMentor</h1>
                    <p className="lead">
                      {" "}
                      Create a tutor profile/portfolio, share posts and get help
                      from tutors
                    </p>
                    <hr />
                    <Link to="/registerT" className="btn btn-lg btn-info mr-2">
                      Sign Up As a Tutor
                    </Link>
                    <Link to="/login" className="btn btn-lg btn-light">
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ backgroundColor: "#dedede" }}>
          <div class="container">
            <div class="row align-items-center">
              <div class="col-md-8 offset-md-2 offset-lg-0">
                <h1
                  class="text-right text-sm-right"
                  style={{ padding: "12px" }}
                >
                  Find a tutor for live help
                </h1>
              </div>
              <div class="col-lg-6 order-lg-1">
                <div class="p-5" style={{ margin: "-20px" }}>
                  <h3 class="display-4" style={{ fontSize: "56px" }}>
                    Get live 1:1 help tailored to you
                  </h3>
                  <p>Get answers to your questions</p>
                  <p>Sign up for a free account now&nbsp;</p>
                </div>
              </div>
              <div
                class="col-lg-6 order-lg-2"
                style={{ height: "400px", width: "400px" }}
              >
                <div class="p-5">
                  <img
                    src={Img2}
                    class="rounded-circle img-fluid"
                    style={{
                      width: "350px",
                      height: "350px",
                      padding: "18px",
                      margin: "-31px"
                    }}
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div class="container">
            <div class="row align-items-center">
              <div class="col-lg-6 order-lg-2">
                <div class="p-5">
                  <h2 class="display-4">Have access to tutors with ease</h2>
                  <p>Book a session with one of our tutors right now.&nbsp;</p>
                  <p>
                    Check to see the tutor's availability and tailor sessions to
                    fit your schedule.
                  </p>
                </div>
              </div>
              <div class="col" style={{ padding: "22px" }}>
                <img
                  src={Img3}
                  style={{ width: "350px", height: "350px" }}
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>
        <section>
          <div class="container">
            <div class="row align-items-center">
              <div class="col-lg-6 order-lg-1">
                <div class="p-5">
                  <h2 class="display-4">What you'll find on eMentor</h2>
                  <p>Help with any course you're taking</p>
                  <p>Access to expert instructors outside office hours</p>
                  <p>
                    Take advantage of our easy setup process to connect to a
                    tutor now
                  </p>
                </div>
              </div>
              <div class="col-lg-6 col-xl-6 order-lg-2">
                <img
                  src={Img1}
                  class="rounded-circle img-fluid"
                  style={{ width: "400px", height: "400px", padding: "9px" }}
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Landing);
