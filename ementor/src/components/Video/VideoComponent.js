import React, { Component } from "react";
import Video from "twilio-video";
import axios from "axios";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import ChatApp from "../Chat/ChatApp";

class VideoComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      votes: "",
      identity: null /* Will hold the fake name assigned */,
      roomName: this.props.match.params.id /* Will store the room name */,
      roomNameErr: false /* Track error for room name TextField. This will    enable us to show an error message when this variable is true */,
      previewTracks: null,
      localMediaAvailable: false /* Represents the availability of a LocalAudioTrack(microphone) and a LocalVideoTrack(camera) */,
      hasJoinedRoom: false,
      activeRoom: null // Track the current active room
    };
  }

  componentDidMount() {
    axios
      .get(`/api/profile/${this.props.match.params.id}/token`)
      .then(results => {
        /*
Make an API call to get the token and identity(fake name) and  update the corresponding state variables.
    */
        const { identity, token } = results.data;
        this.setState({ identity, token });
      });
  }

  handleRoomNameChange = e => {
    /* fetch room name from text field and update state */
    let roomName = this.props.match.params.id;
    this.setState({ roomName });
  };

  joinRoom = () => {
    /* 
Show an error message on room name text field if user tries         joining a room without providing a room name. This is enabled by setting `roomNameErr` to true
  */
    if (!this.state.roomName.trim()) {
      this.setState({ roomNameErr: true });
      return;
    }
    console.log("Joining room" + this.state.roomName + "...");

    let connectOptions = {
      name: this.state.roomName
    };

    if (this.state.previewTracks) {
      connectOptions.tracks = this.state.previewTracks;
    }
    /* 
Connect to a room by providing the token and connection    options that include the room name and tracks. 

'


 also show an alert if an error occurs while connecting to the room.    
*/

    Video.connect(
      this.state.token,
      connectOptions
    ).then(this.roomJoined, error => {
      alert("could not connect to Twilio: " + error.message);
    });
  };

  // Attach the Tracks to the DOM.
  attachTracks(tracks, container) {
    tracks.forEach(track => {
      container.appendChild(track.attach());
    });
  }

  // Attach the Participant's Tracks to the DOM.
  attachParticipantTracks(participant, container) {
    var tracks = Array.from(participant.tracks.values());
    this.attachTracks(tracks, container);
  }
  roomJoined = room => {
    // Called when a participant joins a room
    console.log("Joined as '" + this.state.identity + "'");
    this.setState({
      activeRoom: room,
      localMediaAvailable: true,
      hasJoinedRoom: true // Removes ‘Join Room’ button and shows ‘Leave Room’
    });

    // Attach LocalParticipant's tracks to the DOM, if not already attached.
    var previewContainer = this.refs.localMedia;
    if (!previewContainer.querySelector("video")) {
      this.attachParticipantTracks(room.localParticipant, previewContainer);
    }
    // Attach the Tracks of the room's participants.
    room.participants.forEach(participant => {
      console.log("Already in Room: '" + participant.identity + "'");
      var previewContainer = this.refs.remoteMedia;
      this.attachParticipantTracks(participant, previewContainer);
    });

    // Participant joining room
    room.on("participantConnected", participant => {
      console.log("Joining: '" + participant.identity + "'");
    });

    // Attach participant’s tracks to DOM when they add a track
    room.on("trackAdded", (track, participant) => {
      console.log(participant.identity + " added track: " + track.kind);
      var previewContainer = this.refs.remoteMedia;
      this.attachTracks([track], previewContainer);
    });

    // Detach participant’s track from DOM when they remove a track.
    room.on("trackRemoved", (track, participant) => {
      console.log(participant.identity + " removed track: " + track.kind);
      this.detachTracks([track]);
    });

    // Detach all participant’s track when they leave a room.
    room.on("participantDisconnected", participant => {
      console.log("Participant '" + participant.identity + "' left the room");
      this.detachParticipantTracks(participant);
    });

    // Once the local participant leaves the room, detach the Tracks
    // of all other participants, including that of the LocalParticipant.
    room.on("disconnected", () => {
      if (this.state.previewTracks) {
        this.state.previewTracks.forEach(track => {
          track.stop();
        });
      }
      this.detachParticipantTracks(room.localParticipant);
      room.participants.forEach(this.detachParticipantTracks);
      this.state.activeRoom = null;
      this.setState({ hasJoinedRoom: false, localMediaAvailable: false });
    });
  };

  leaveRoom = () => {
    this.state.activeRoom.disconnect();
    this.setState({ hasJoinedRoom: false, localMediaAvailable: false });
  };

  detachTracks = tracks => {
    tracks.forEach(track => {
      track.detach().forEach(detachedElement => {
        detachedElement.remove();
      });
    });
  };

  detachParticipantTracks = participant => {
    var tracks = Array.from(participant.tracks.values());
    this.detachTracks(tracks);
  };

  onVote = e => {
    this.setState({ votes: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const vote = {
      votes: this.state.votes
    };

    axios
      .post(`/api/profile/${this.props.match.params.username}/vote`, vote)
      .then(
        res =>
          this.props.history.push(
            `/profile/${this.props.match.params.username}`
          ),
        window.location.reload()
      )

      .catch(err => console.log(err));
  };

  render() {
    const { auth } = this.props;
    /* 
   Controls showing of the local track
   Only show video track after user has joined a room else show nothing 
  */

    let showLocalTrack = this.state.localMediaAvailable ? (
      <div className="flex-item">
        <div ref="localMedia" />{" "}
      </div>
    ) : (
      ""
    );
    /*
   Controls showing of ‘Join Room’ or ‘Leave Room’ button.  
   Hide 'Join Room' button if user has already joined a room otherwise 
   show `Leave Room` button.
  */

    let joinOrLeaveRoomButton = this.state.hasJoinedRoom ? (
      <Button
        color="secondary"
        variant="outlined"
        onClick={this.leaveRoom}
        style={{ width: "200px" }}
      >
        Exit Session
      </Button>
    ) : (
      <Button
        color="primary"
        variant="outlined"
        onClick={this.joinRoom}
        style={{ width: "200px" }}
      >
        Join Session
      </Button>
    );
    return (
      <div className="videoRoom">
        <Grid container spacing={8}>
          <Grid item xs={8}>
            {showLocalTrack}
            {/*show local track if available */}
            <div className="flex-item">
              {/*The following text field is used to enter a room name. It calls  `handleRoomNameChange` method when the text changes which sets the `roomName` variable initialized in the state.*/}
              <br />
              {joinOrLeaveRoomButton}{" "}
              {/* Show either ‘Leave Room’ or ‘Join Room’ button */}
            </div>
          </Grid>

          <Grid item xs={4}>
            {/* 
The following div element shows all remote media (other                             participant’s tracks) 
    */}

            <div className="flex-item" ref="remoteMedia" id="remote-media" />

            {auth.user.id === this.props.match.params.id ? (
              <button
                type="button"
                className="btn btn-info btn-lg"
                data-toggle="modal"
                data-target="#myModal"
                style={{ display: "none" }}
              >
                Rate Tutor
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-info btn-lg"
                data-toggle="modal"
                data-target="#myModal"
              >
                Rate Tutor
              </button>
            )}

            <div className="modal fade" id="myModal" role="dialog">
              <div className="modal-dialog modal-sm">
                <div className="modal-content">
                  <div className="modal-header">
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={this.onSubmit}>
                      <input
                        type="number"
                        max="10"
                        min="0"
                        onChange={this.onVote}
                      />{" "}
                      / 10
                      <div className="modal-footer">
                        <button type="submit" className="btn btn-default">
                          Rate
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Grid>

          <Grid item xs={12}>
            <ChatApp name={this.props.match.params.id} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

VideoComponent.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(VideoComponent);
