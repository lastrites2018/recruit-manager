import React, { Component } from 'react'
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './components/Login'
import Job from './components/menu/Job'
import Mail from './components/menu/Mail'
import People from './components/menu/People'
import Sms from './components/menu/Sms'
import Navbar from './components/Navbar/'
import Crawling from './components/menu/Crawling'
import './App.css'

class App extends Component {
  state = {
    isLoggedIn: false,
    user_id: ''
  }

  login = user_id => this.setState(prevState => ({ isLoggedIn: true, user_id }))

  logout = () => this.setState({ isLoggedIn: false })

  isLoggedIn = () => {
    return sessionStorage.getItem('adminLoggedIn')
  }

  componentDidMount() {
    if (this.isLoggedIn()) {
      this.login(sessionStorage.getItem('user_id'))
    } else this.logout()
  }

  render() {
    return (
      <Router>
        <div id="App">
          <Navbar />
          <Switch>
            {this.state.isLoggedIn ? (
              // <Route exact path="/" component={People} />
              <Route
                exact
                path="/"
                render={() => <People user_id={this.state.user_id} />}
              />
            ) : (
              <Route
                path="/"
                render={() => (
                  <Login
                    isLoggedIn={this.state.isLoggedIn}
                    login={this.login}
                  />
                )}
              />
            )}

            <Route
              path="/job"
              render={() => <Job user_id={this.state.user_id} />}
            />
            <Route
              path="/people"
              render={() => <People user_id={this.state.user_id} />}
            />
            <Route path="/mail" component={Mail} user_id={this.state.user_id} />
            <Route path="/sms" component={Sms} user_id={this.state.user_id} />
            <Route
              path="/crawling"
              render={() => <Crawling user_id={this.state.user_id} />}
            />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
