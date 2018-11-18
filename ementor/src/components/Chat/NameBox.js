import React, { Component } from "react";
import Button from "@material-ui/core/Button";

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
          <Button
            color="primary"
            variant="outlined"
            type="submit"
            style={{ width: "200px" }}
          >
            Open Text Box
          </Button>
        </form>
      </div>
    );
  }
}

export default NameBox;
