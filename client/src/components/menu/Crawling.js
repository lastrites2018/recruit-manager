import React, { Component } from 'react'
import Axios from 'axios'
import API from '../../util/api'
import CrawlingForm from '../forms/CrawlingForm'
import 'react-table/react-table.css'
import './menu.css'

export default class Crawling extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleSearch({
    user_id,
    min_age,
    max_age,
    keyword,
    position,
    area,
    websites
  }) {
    console.log('search button has been clicked!')

    alert(
      `keyword : ${keyword} area : ${area} age : ${min_age}|${max_age} ${websites}로 크롤링 요청을 하였습니다.`
    )
    Axios.post(API.crawling, {
      user_id: this.props.user_id,
      keyword: keyword,
      area: area,
      age: `${min_age}|${max_age}`,
      career: '',
      crawling_site: websites,
      page_threshold: ''
    })
      .then(res => {
        console.log('crawling?', res) // currently cooking api, need to wait
      })
      .catch(err => {
        console.log('크롤링 요청에 실패하였습니다.')
      })
  }

  render() {
    return (
      <div>
        <CrawlingForm.CrawlingRegistration
          handleSearch={this.handleSearch}
          user_id={this.props.user_id}
        />
      </div>
    )
  }
}
