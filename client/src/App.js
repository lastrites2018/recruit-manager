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
    console.log('실행?')
    return (
      <Router>
        <div id="App">
          <Navbar />
          <div className="site-content">
            <Switch>
              {this.state.isLoggedIn ? (
                <Route exact path="/" component={People} />
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

              <Route path="/job" component={Job} />
              <Route
                path="/people"
                render={() => <People user_id={this.state.user_id} />}
              />
              <Route path="/mail" component={Mail} />
              <Route path="/sms" component={Sms} />
              <Route path="/crawling" component={Crawling} />
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}

export default App
