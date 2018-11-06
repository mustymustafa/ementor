import React, { Component } from "react";
import Video from "twilio-video";
import axios from "axios";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

import ChatApp from "../Chat/ChatApp";

class VideoComponent extends Component {
  constructor(props) {
    super();

    this.state = {
      identity: null /* Will hold the fake name assigned */,
      roomName: "" /* Will store the room name */,
      roomNameErr: false /* Track error for room name TextField. This will    enable us to show an error message when this variable is true */,
      previewTracks: null,
      localMediaAvailable: false /* Represents the availability of a LocalAudioTrack(microphone) and a LocalVideoTrack(camera) */,
      hasJoinedRoom: false,
      activeRoom: null // Track the current active room
    };
  }

  componentDidMount() {
    axios.get("/token").then(results => {
      /*
Make an API call to get the token and identity(fake name) and  update the corresponding state variables.
    */
      const { identity, token } = results.data;
      this.setState({ identity, token });
    });
  }

  handleRoomNameChange = e => {
    /* fetch room name from text field and update state */
    let roomName = e.target.value;
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

  render() {
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
      <Button color="secondary" variant="outlined" onClick={this.leaveRoom}>
        Exit Session
      </Button>
    ) : (
      <Button color="primary" variant="outlined" onClick={this.joinRoom}>
        Join Session
      </Button>
    );
    return (
      <div>
        <Grid container spacing={8}>
          <Grid item xs={8}>
            {showLocalTrack}
            {/*show local track if available */}
            <div className="flex-item">
              {/*The following text field is used to enter a room name. It calls  `handleRoomNameChange` method when the text changes which sets the `roomName` variable initialized in the state.*/}
              <TextField
                label="Room name"
                onChange={this.handleRoomNameChange}
                onError={
                  this.state.roomNameErr ? "Room Name is Required" : undefined
                }
              />
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
          </Grid>

          <Grid item xs={12}>
            <ChatApp />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default VideoComponent;
