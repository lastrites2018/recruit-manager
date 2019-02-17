/*global chrome*/
import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    chrome.runtime.sendMessage({ action: "popupOpen" });
  }

  render() {
    return (
      <div>
        <h1>Recruit Manager</h1>
        <h3>Sangmo Kang | Careersherpa</h3>
      </div>
    );
  }
}

export default App;
