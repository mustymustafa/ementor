import React, { Component } from "react";
import NameBox from "./NameBox.js";
import Chat from "twilio-chat";
import Editor from "../Editor";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class ChatApp extends Component {
  constructor(props) {
    super(props);

    const name = localStorage.getItem("name") || "";
    const loggedIn = name !== "";

    this.state = {
      name,
      loggedIn,
      token: "",
      chatReady: false,
      messages: [],
      newMessage: ""
    };
    this.channelName = "general";
  }

  componentWillMount = () => {
    if (this.state.loggedIn) {
      this.getToken();
    }
  };

  getToken = () => {
    fetch("/api/profile/chattoken", {
      method: "POST"
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ token: data.token }, this.initChat);
      });
  };

  logIn = event => {
    event.preventDefault();
    if (this.state.name !== "") {
      localStorage.setItem("name", this.state.name);
      this.setState({ loggedIn: true }, this.getToken);
    }
  };

  logOut = event => {
    event.preventDefault();
    this.setState({
      name: "",
      loggedIn: false,
      token: "",
      chatReady: false,
      messages: [],
      newMessage: ""
    });
    localStorage.removeItem("name");
    this.chatClient.shutdown();
    this.channel = null;
  };

  initChat = () => {
    this.chatClient = new Chat(this.state.token);
    this.chatClient.initialize().then(this.clientInitiated.bind(this));
  };

  clientInitiated = () => {
    this.setState({ chatReady: true }, () => {
      this.chatClient
        .getChannelByUniqueName(this.channelName)
        .then(channel => {
          if (channel) {
            return (this.channel = channel);
          }
        })
        .catch(err => {
          if (err.body.code === 50300) {
            return this.chatClient.createChannel({
              uniqueName: this.channelName
            });
          }
        })
        .then(channel => {
          this.channel = channel;
          window.channel = channel;
          return this.channel.join();
        })
        .then(() => {
          this.channel.getMessages(); //.then(this.messagesLoaded);
          this.channel.on("messageAdded", this.messageAdded);
        });
    });
  };

  // messagesLoaded = messagePage => {
  // this.setState({ messages: messagePage.items });
  //};

  messageAdded = message => {
    this.setState((prevState, props) => ({
      messages: [...prevState.messages, message]
    }));
  };

  onMessageChanged = html => {
    this.setState({ newMessage: html });
  };

  onNameChanged = e => {
    this.setState({ name: e.target.value });
  };
  sendMessage = event => {
    event.preventDefault();
    const message = this.state.newMessage;
    this.setState({ newMessage: "" });
    this.channel.sendMessage(message);
  };

  newMessageAdded = li => {
    if (li) {
      li.scrollIntoView();
    }
  };

  render() {
    const { name } = this.props;
    const { user } = this.props.auth;

    const firstname = user.fn.trim().split(" ")[0];
    this.state.name = name;

    var loginOrChat;
    const messages = this.state.messages.map(message => {
      return (
        <li key={message.sid} ref={this.newMessageAdded}>
          <b>{firstname}</b>{" "}
          <div dangerouslySetInnerHTML={{ __html: message.body }} />
        </li>
      );
    });
    if (this.state.loggedIn) {
      loginOrChat = (
        <div className="chatbox">
          <div style={{ textAlign: "center" }}>
            <h3>Messages</h3>
          </div>

          <ul className="messages">{messages}</ul>
          <form onSubmit={this.sendMessage} style={{ minHeight: "300px" }}>
            <label
              className="chatlabel"
              htmlFor="message"
              style={{ textAlign: "center" }}
            />
            <Editor
              name="newMessage"
              id="message"
              onChange={this.onMessageChanged}
              value={this.state.newMessage}
            />

            <Button
              type="submit"
              color="primary"
              variant="outlined"
              style={{ width: "100px" }}
            >
              send
            </Button>
          </form>
          <br />
          <br />
          <form className="closebutton" onSubmit={this.logOut}>
            <Button
              type="submit"
              color="secondary"
              variant="outlined"
              style={{ width: "100px" }}
            >
              close
            </Button>
          </form>
        </div>
      );
    } else {
      loginOrChat = (
        <div>
          <NameBox name={name} logIn={this.logIn} />
        </div>
      );
    }
    return <div>{loginOrChat}</div>;
  }
}

ChatApp.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(ChatApp);
