import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './components/Login'
import Main from './components/Main'
import './App.css'

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
    this.setState({ isLoggedIn: false })
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
        <div id='App'>
          <div className='site-content'>
            <Switch>
              <Route path='/login' component={Login} />
              <Route path='/' component={Main} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App
