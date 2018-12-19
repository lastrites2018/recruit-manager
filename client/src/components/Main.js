import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

export default class Main extends Component {
  state = {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu>
				<Menu.Item header>Recruit Manager</Menu.Item>
        <Menu.Item
          name='Job'
          active={activeItem === 'Job'}
          onClick={this.handleItemClick}
        >
          Job
        </Menu.Item>

        <Menu.Item 
            name='Mail' 
            active={activeItem === 'Mail'} 
            onClick={this.handleItemClick}>
          Mail
        </Menu.Item>

        <Menu.Item
          name='People'
          active={activeItem === 'People'}
          onClick={this.handleItemClick}
        >
          People
        </Menu.Item>
        <Menu.Item
          name='SMS'
          active={activeItem === 'SMS'}
          onClick={this.handleItemClick}
        >
          SMS
        </Menu.Item>
      </Menu>
    )
  }
}