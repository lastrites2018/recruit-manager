import React, { Component } from 'react'
import Axios from 'axios'
import API from '../../util/api'
import CrawlingForm from '../forms/CrawlingForm'
import 'react-table/react-table.css'
import './menu.css'

export default class Crawling extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
	}
	
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
			<div>
				<CrawlingForm.CrawlingRegistration />
			</div>
		)
  }
}