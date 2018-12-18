import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './components/Login'
import './App.css';

class App extends Component {
  state = {
    isLoggedIn: false
  }

  login = () => {
    this.setState(prevState => ({
      isLoggedIn: true
    }));
  };

  logout = () => {
    this.setState({ isLoggedIn: false });
  };

  // componentDidMount() {
  //   if (util.isLoggedIn()) {
  //     this.login();
  //   } else {
  //     this.logout();
  //   }
  // }

  render() {
    return (
      <Router>
        <div id="App">
          <div className="site-content">
            <Switch>
              <Route exact path="/" component={Login} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
