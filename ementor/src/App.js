import React, { Component } from "react";
import "./App.css";
import Landing from "./components/Layout/Landing/Landing";
import Navbar from "./components/Layout/Navbar/Navbar";
import Footer from "./components/Layout/Footer/Footer";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";

import Register from "./components/auth/Register";

import Login from "./components/auth/Login";

import { Provider } from "react-redux";
import store from "./store";

import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/profileActions/CreateProfile";
import Profile from "./components/profileActions/Profile";

import Profiles from "./components/profiles/Profiles";
import SasProfile from "./components/profiles/Profiles.1";
import SbeProfile from "./components/profiles/Profiles.2";
import SolProfile from "./components/profiles/Profiles.3";
import Username from "./components/profiles/Username";

import PrivateRoute from "./components/common/private Route/PrivateRoute";
import Notfound from "./components/not found/Notfound";

import Posts from "./components/posts/Posts";

import Post from "./components/Post/Post";

import Video from "./components/Video/VideoComponent";
//check for token. to check if user is logged in
if (localStorage.jwtToken) {
  //set auth token header auth
  setAuthToken(localStorage.jwtToken);
  //decode token and get user info and expiration
  const decoded = jwt_decode(localStorage.jwtToken);
  //set tutor and isAuthentication
  store.dispatch(setCurrentUser(decoded));

  //check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    store.dispatch(clearCurrentProfile());
    //redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />

            <Route exact path="/" component={Landing} />

            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/profiles" component={Profiles} />
              <Route exact path="/sasprofiles" component={SasProfile} />
              <Route exact path="/sbeprofiles" component={SbeProfile} />
              <Route exact path="/solprofiles" component={SolProfile} />
              <Route exact path="/posts" component={Posts} />
              <Switch>
                {" "}
                <PrivateRoute exact path="/profile" component={Dashboard} />
              </Switch>
              <PrivateRoute
                exact
                path="/profile/:username"
                component={Username}
              />
              <Switch>
                {" "}
                <PrivateRoute
                  exact
                  path="/createprofile"
                  component={CreateProfile}
                />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/editprofile" component={Profile} />
              </Switch>{" "}
              <Route exact path="/not-found" component={Notfound} />
              <Switch>
                <PrivateRoute exact path="/post/:id" component={Post} />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/session/:id" component={Video} />
              </Switch>{" "}
            </div>

            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
