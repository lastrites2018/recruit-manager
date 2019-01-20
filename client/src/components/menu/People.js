import React, { Component } from 'react'
import Axios from 'axios'
import API from '../../util/api'

import { EditableFormRow, EditableCell } from '../../util/Table'
import 'react-table/react-table.css'
import './menu.css'
import { Input, Select, Button, Checkbox, Spin } from 'antd'
export default class People extends Component {
  constructor(props) {
    super(props)
    this.state = {
      minAge: '',
      maxAge: '',
      isTopSchool: false,
      position: ''
    }
  }

  fetch = () => {
    const { minAge, maxAge, isTopSchool, position } = this.state
    Axios.post(API.mainTable, {
      under_age: minAge,
      upper_age: maxAge,
      top_school: isTopSchool,
      keyword: position
    }).then(data => {
      const pagination = { ...this.state.pagination }
      pagination.total = 200
      this.setState({
        dataSource: data.data.result,
        pagination
      })
    })
  }

  checkTopschool = e => {
    console.log(`isTopSchool === ${e.target.checked}`)
    this.setState({ isTopSchool: e.target.checked })
  }

  handlePositionChange = value => {
    // console.log('event', value)
    this.setState({ position: value })
  }

  handleAgeChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = e => {
    console.log(this.state)
  }

  render() {
    const InputGroup = Input.Group
    const Option = Select.Option
    const { user_id } = this.props
    const { minAge, maxAge, isTopSchool, position } = this.state

    return (
      <div>
        <br />
        <InputGroup compact>
          <Input
            style={{ width: '10%' }}
            placeholder="min age"
            name="minAge"
            onChange={this.handleAgeChange}
          />
          <Input
            style={{ width: '10%' }}
            placeholder="max age"
            name="maxAge"
            onChange={this.handleAgeChange}
          />
          <Checkbox
            style={{ marginLeft: '30px' }}
            onChange={this.checkTopschool}
          >
            Top School
          </Checkbox>
        </InputGroup>
        <br />
        <Input style={{ width: '20%' }} defaultValue="검색어 (And, Or)" />
        <br />
        <Select
          showSearch
          style={{ width: '30%' }}
          placeholder="Choose a position"
          optionFilterProp="children"
          onChange={this.handlePositionChange}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          <Option value="개발자">개발자</Option>
          <Option value="관리자">관리자</Option>
          <Option value="매니저">매니저</Option>
          <Option value="프론트엔드">프론트엔드</Option>
          <Option value="백엔드">백엔드</Option>
        </Select>
        <Button
          style={{ marginLeft: '10px' }}
          type="primary"
          icon="search"
          onClick={this.handleSubmit}
        >
          Search
        </Button>
        <br />
        <EditableTable
          user_id={user_id}
          minAge={minAge}
          maxAge={maxAge}
          isTopSchool={isTopSchool}
          position={position}
        />
      </div>
    )
  }
}
