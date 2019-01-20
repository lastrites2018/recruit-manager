import React, { Component } from 'react'
import EditableTable from './PeopleTable'
import 'react-table/react-table.css'
import './menu.css'
import { Input, Select, Button, Checkbox } from 'antd'

export default class People extends Component {
  checkTopschool = e => {
    console.log(`isTopSchool === ${e.target.checked}`)
  }
  
  render() {
    const InputGroup = Input.Group
    const Option = Select.Option

    return (
      <div>
        <br />
        <InputGroup compact>
          <Input style={{ width: '10%' }} placeholder="min age" />
          <Input style={{ width: '10%' }} placeholder="max age" />
          <Checkbox onChange={this.checkTopschool}>Top School?</Checkbox>
        </InputGroup>
        <br />
        <Input style={{ width: '20%' }} defaultValue="검색어 (And, Or" />
        <br />
        <Select style={{ width: '30%' }} placeholder="Choose a position">
          <Option value="Position1">Position1</Option>
          <Option value="Position2">Position2</Option>
        </Select>
        <Button type="primary" icon="search">
          Search
        </Button>
        <br />
        <EditableTable />
      </div>
    )
  }
}
