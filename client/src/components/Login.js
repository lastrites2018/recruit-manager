import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Form, Grid, Header, Image, Segment } from 'semantic-ui-react'
// import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.min.css'

export default class Login extends Component {
	state = {
		email: '',
		password: '',
		isAdminLoggedIn: false
	}
  render() {
    return (
      <div>
        <div className="login-form" style={{ paddingTop: '30vh' }}>
          <Grid
            textAlign="center"
            style={{ height: '100%' }}
            verticalAlign="middle"
          >
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as="h2" color="red" textAlign="center">
                <Image src="/favicon.ico" /> Log-in to your account
              </Header>
              <Form size="large">
                <Segment stacked>
                  <Form.Input
                    fluid
                    icon="user"
                    iconPosition="left"
                    placeholder="ID"
                  />
                  <Form.Input
                    fluid
                    icon="lock"
                    iconPosition="left"
                    placeholder="Password"
                    type="password"
                  />

                  <Button color="red" fluid size="large">
                    Login
                  </Button>
                </Segment>
              </Form>
            </Grid.Column>
          </Grid>
          {/* <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange
            draggable={false}
            pauseOnHover
          /> */}
        </div>
      </div>
    )
  }
}
