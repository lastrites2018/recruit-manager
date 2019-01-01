import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Form, Grid, Header, Image, Segment } from 'semantic-ui-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import axios from 'axios'
import API from '../util/api'

export default class Login extends Component {
	state = {
		user_id: '',
		password: '',
		isAdminLoggedIn: false
  }

  _checkLogin() {
    axios
      .post(API.loginValidation, {
        user_id: this.state.user_id,
        password: this.state.password
      })
      .then(res => {
        if (res.data.result === true) {
          this.setState({ isAdminLoggedIn: true })
          localStorage.setItem('adminLoggedIn', this.state.isAdminLoggedIn)
        }
        else {
          console.log('ERROR: Invalid username or password')
          toast.error('Authentication failed')
        }
      })
      .catch(err => {
        console.log(err.response)
      })
  }

  _handleUsername(data) {
    this.setState({ user_id: data.value })
  }

  _handlePassword(data) {
    this.setState({ password: data.value })
  }

  render() {
    if (!this.state.isAdminLoggedIn) {
    return (
      <div>
        <div className='login-form' style={{ paddingTop: '30vh' }}>
          <Grid
            textAlign='center'
            style={{ height: '100%' }}
            verticalAlign='middle'
          >
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as='h2' color='red' textAlign='center'>
                <Image src='/favicon.ico' />
                Login to your account
              </Header>
              <Form size='large' onSubmit={() => this._checkLogin()}>
                <Segment stacked>
                  <Form.Input
                    fluid
                    icon='user'
                    iconPosition='left'
                    placeholder='아이디'
                    onChange={(e, data) => this._handleUsername(data)}
                  />
                  <Form.Input
                    fluid
                    icon='lock'
                    iconPosition='left'
                    placeholder='비밀번호'
                    type='password'
                    onChange={(e, data) => this._handlePassword(data)}
                  />
                  <Button color='red' fluid size='large'>로그인</Button>
                </Segment>
              </Form>
            </Grid.Column>
          </Grid>
          <ToastContainer />
        </div>
      </div>
    )
  } else {
    return <Redirect to={'/people'} />
    }
  }
}
