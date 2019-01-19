import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'antd'

export default class Test extends React.Component {
  state = {
    current: 'people'
  }

  handleClick = (e) => {
    this.setState({
      current: e.key
    })
  }

  render() {
    console.log('state?!', this.state)
    return (
      <Menu
        onClick={this.handleClick}
        selectedKeys={this.state.current}
        mode='horizontal'
        >
        <Menu.Item 
          key='people'
          onClick={this.handleClick}
          >
          <Link to='/'><span><Icon type='home' /><span>Recruit Manager</span></span></Link>
        </Menu.Item>
        <Menu.Item 
          key='job'
          onClick={this.handleClick}
          >
          <Link to='/job'><span>Job</span></Link>
        </Menu.Item>
        <Menu.Item 
          key='mail'
          onClick={this.handleClick}
          >
          <Link to='/mail'><span>Mail</span></Link>
        </Menu.Item>
        <Menu.Item 
          key='SMS'
          onClick={this.handleClick}
          >
          <Link to='/sms'><span>SMS</span></Link>
        </Menu.Item>
        <Menu.Item 
          key='crawling'
          onClick={this.handleClick}
          >
          <Link to='/crawling'><span>Crawling</span></Link>
        </Menu.Item>
      </Menu>
    )
  }
}
