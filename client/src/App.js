import React, { Component } from 'react'
import { Switch, BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Login from './components/Login'
import Job from './components/menu/Job'
import Mail from './components/menu/Mail'
import People from './components/menu/People'
import Sms from './components/menu/Sms'
import Navbar from './components/Navbar/';
import './App.css'

class App extends Component {
  state = {
    isLoggedIn: false
  }

  login = () => this.setState(prevState => ({ isLoggedIn: true }))

  logout = () => this.setState({ isLoggedIn: false })

  isLoggedIn = () => {
    return localStorage.getItem('adminLoggedIn')
  }

  componentDidMount() {
    if (this.isLoggedIn()) this.login()
    else this.logout()
  }

  render() {
    return (
      <Router>
        <div id='App'>
          <Navbar />
          <div className='site-content'>
            <Switch>
              <Route exact path='/' render={() => (
                this.state.isLoggedIn ? ( <Route component={People} />)
                : (<Route component={Login} />)
              )} />
              <Route path='/job' component={Job} />
              <Route path='/people' component={People} />
              <Route path='/mail' component={Mail} />
              <Route path='/sms' component={Sms} /> 
            </Switch>
          </div>
        </div>
      </Router>
    );
  }

}

export default App
