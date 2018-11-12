import React, { Component } from "react";

class NameBox extends Component {
  render() {
    const inputStyle = {
      display: "none"
    };

    const { name } = this.props;

    const logIn = this.props.logIn;
    return (
      <div>
        <form onSubmit={logIn}>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            style={inputStyle}
          />
          <button type="submit">Open Text Box</button>
        </form>
      </div>
    );
  }
}

export default NameBox;
