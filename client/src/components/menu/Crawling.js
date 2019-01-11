import React, { Component } from 'react'
import Axios from 'axios'
import API from '../../util/api'
import 'react-table/react-table.css'
import './menu.css'
import {
	Button,
	Container,
	Form,
  Grid,
	Icon,
} from 'semantic-ui-react'

export default class Crawling extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
	}
	
	websiteOptions = [
    {
      text: 'LinkedIn',
      value: 'LinkedIn'
    },
    {
      text: 'Jobkorea',
      value: 'Jobkorea'
		},
		{
      text: 'Saramin',
      value: 'Saramin'
		},
		{
      text: 'Incruit',
      value: 'Incruit'
    }
	]

	positionOptions = [
    // need api (post)
    {
      text: 'Position 1',
      value: 'Position 1'
    },
    {
      text: 'Position 2',
      value: 'Position 2'
    }
	]
	
	_handleSearch(event) {
		event.preventDefault()
		console.log('search button has been clicked!')

		Axios.post(API.crawling, {
      user_id: 'rmrm',
      area: '서울',
      age: '30',
      career: '13년',
      crawling_site: 'incrute'
    })
      .then(res => {
        console.log('crawling?', res) // currently cooking api, need to wait
        // this.setState({
					
        // })
      })
      .catch(err => {
        console.log(err.response)
      })
	}
	
  render() {
      return (
				<Container>
					<Grid>
						<Grid.Row column={2} inline>
							<Grid.Column>
								<Form>
									<Form.Group>
										<Form.Input
											label='min_age'
											placeholder='min_age'
											width={2}
										/>
										<Form.Input
											label='max_age'
											placeholder='max_age'
											width={2}
										/>
									</Form.Group>
								</Form>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row column={1}>
							<Grid.Column width={14}>
								<Form>
									<Form.Input
										control='textarea'
										label='keyword'
										placeholder='#java #orm #opensource #spring #springframework'
										type='text'
										rows={2}
										width={5}
									/>
								</Form>
							</Grid.Column>
						</Grid.Row >
						<Grid.Row column={1}>
							<Grid.Column width={14}>
								<Form>
									<Form.Input 
										label='area'
										placeholder='Seoul'
										width={5} 
									/>
								</Form>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row column={1}>
							<Grid.Column>
								<Form>
								<Form.Dropdown
									label= 'Websites'
									placeholder='LinkedIn | Jobkorea | Saramin | Incruit'
									multiple
									selection
									options={this.websiteOptions}
									style={{ minWidth: '10em', maxWidth: '22em' }}
            		/>
								</Form>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row column={1}>
							<Grid.Column>
								<Form>
									<Form.Dropdown
										label='Position'
										placeholder='Position'
										multiple
										selection
										options={this.positionOptions}
										style={{ minWidth: '10em', maxWidth: '22em' }}
									/>
								</Form>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row column={1}>
							<Button
								circular
								icon
								labelPosition='right'
								onClick={this._handleSearch}
								>
								Search
								<Icon name='search' />
							</Button>
						</Grid.Row>
					</Grid>
				</Container>
      )
      
  }
}