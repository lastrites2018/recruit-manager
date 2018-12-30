import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
// import { Grid, Menu } from 'semantic-ui-react'

export default class Main extends Component {
  state = {

  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    // const { activeItem } = this.state

    return (

      <Grid container stackable verticalAlign="middle">
        <Grid.Row>
          <Grid.Column>
           아직 안 쓰는 메인 페이지 -> 추후 people을 메인으로 둬야 함. 
           음... 그냥 login을 메인으로 두고, 로그인 하면 바로 people로 넘어가고 이건 날려도 될 듯
      
        </Grid.Column>
        </Grid.Row>
      </Grid>


      // <Menu>
      //   <Menu.Item header>Recruit Manager</Menu.Item>
      //   <Menu.Item
      //     name='Job'
      //     active={activeItem === 'Job'}
      //     onClick={this.handleItemClick}
      //   >
      //     Job
      //   </Menu.Item>

      //   <Menu.Item
      //     name='People'
      //     active={activeItem === 'People'}
      //     onClick={this.handleItemClick}
      //   >
      //     People
      //   </Menu.Item>

      //   <Menu.Item
      //     name='Mail'
      //     active={activeItem === 'Mail'}
      //     onClick={this.handleItemClick}>
      //     Mail
      //   </Menu.Item>

      //   <Menu.Item
      //     name='SMS'
      //     active={activeItem === 'SMS'}
      //     onClick={this.handleItemClick}
      //   >
      //     SMS
      //   </Menu.Item>
      // </Menu>
    )
  }
}