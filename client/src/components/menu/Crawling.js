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

  handleSearch({ min_age, max_age, keyword, area, websites }) {
    {
    }
    console.log('search button has been clicked!')
    console.log('crawling-userid', this.props.user_id)
    Axios.post(API.crawling, {
      user_id: this.props.user_id,
      keyword: keyword,
      area: area,
      age: `${min_age}|${max_age}`,
      career: '',
      crawling_site: websites,
      page_threshold: ''
      // keyword: keyword,
      // area: '서울',
      // age: '20|25',
      // career: '삼성전자',
      // crawling_site: 'incrute',
      // page_threshold: ''
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
        <CrawlingForm.CrawlingRegistration handleSearch={this.handleSearch} />
      </div>
    )
  }
}
