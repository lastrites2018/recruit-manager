import React, { Component } from 'react'
import { Container, Header } from 'semantic-ui-react'

// const userStyle = {
//   textAlign: 'right'
// }

class App extends Component {
  render() {
    return (
      <Container>
        <Header as='h1'>Recruit Manager</Header>
        <Header as='h3'>Name | Company</Header>
        <div>Total Time: </div>
        <div>Today's Resume: </div>
        <div>Mail: </div>
        <div>SMS: </div>
        <br></br>
        <Header as='h4'>[History]</Header>
        <div>Viewed By CS. Lee | CS Kim | </div>
        <Header as='h4'>[Position]</Header>
        <div>SKT 텔레콤 Big Data Engineer | 2018.11.20 | CS Lee</div>
        <div>Naver Clova Team  | 2018.11.19 | CS Kim</div>
        <div>SDS Data Scientist | 2018.11.18 | CS Lee</div>
        <br></br>
      </Container>
    )
  }
} 

export default App;
