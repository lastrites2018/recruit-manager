import React, { Component } from 'react'
import Axios from 'axios'
import API from '../../util/api'
import { Button, Table } from 'antd'

const columns = [{
  title: '수신인',
  dataIndex: 'name',
  render: e => <a href='javascript:'>{e}</a>
}, {
  title: '발송시간',
  dataIndex: 'send_date',
  sorter: true
}, {
  title: 'Client',
  dataIndex: 'client',
}, {
  title: 'Position',
  dataIndex: 'position',
}, {
  title: '수신확인',
  dataIndex: '수신확인'
}]

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
}

export default class SMS extends Component {
  state = {
    loading: true,
    data: [],
    pagination: {}
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    Axios.post(API.getSMS, {
      user_id: 'rmrm',
      rm_id: '*'
    }).then((data) => {
      const pagination = { ...this.state.pagination }
      // Read total count from server
      // pagination.total = data.totalCount
      this.setState({
        loading: false,
        data: data.data.result,
        pagination,
      })
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager,
    })
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    })
  }

  sendSMS = () => {
    // API 안됌, 일단 mail api는 보류!
    Axios.post(API.sendSMS, {
      user_id: 'rmrm',
      recipent: '01072214890',
      subject:'test_subject',
      'body':'test_body'
    })
  }
    
  render() {
    return (
      <div>
        <Button
          type='primary'
          icon='message'
          onClick={this.sendSMS}
        >
          Follow up
        </Button>
        <Table
          columns={columns}
          // rowKey={record => record.login.uuid}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
          rowSelection={rowSelection}
        />
      </div>
    )
  }
}
