import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

class Navbar extends Component {
  state = { activeItem: 'People' }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  handlePeopleItemActive = e => this.setState({ activeItem: 'People' })
  render() {
    const { activeItem } = this.state
    return (
      <React.Fragment>
        <Menu>
          <Menu.Item
            as={Link}
            to="/people"
            onClick={this.handlePeopleItemActive}
            header
          >
            Recruit Manager
          </Menu.Item>

          <Menu.Item
            as={Link}
            to="/job"
            name="Job"
            active={activeItem === 'Job'}
            onClick={this.handleItemClick}
          >
            Job
          </Menu.Item>

          <Menu.Item
            as={Link}
            to="/people"
            name="People"
            active={activeItem === 'People'}
            onClick={this.handleItemClick}
          >
            People
          </Menu.Item>

          <Menu.Item
            as={Link}
            to="/mail"
            name="Mail"
            active={activeItem === 'Mail'}
            onClick={this.handleItemClick}
          >
            Mail
          </Menu.Item>

          <Menu.Item
            as={Link}
            to="/sms"
            name="SMS"
            active={activeItem === 'SMS'}
            onClick={this.handleItemClick}
          >
            SMS
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/crawling"
            name="Crawling"
            active={activeItem === 'Crawling'}
            onClick={this.handleItemClick}
          >
            Crawling
          </Menu.Item>
        </Menu>
      </React.Fragment>
    )
  }
}

export default Navbar
