import React, { Component } from 'react'
import Axios from 'axios'
import API from '../../util/api'
import { Button, Table } from 'antd'

const columns = [{
  title: '수신인',
  dataIndex: 'name',
  render: text => <a href='javascript:'>{text}</a>,
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

export default class Mail extends Component {
  state = {
    loading: true,
    data: [],
    pagination: {}
  }

  componentDidMount() {
    this.fetch()
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

  fetch = () => {
    Axios.post(API.getMail, {
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

  sendMail = () => {
    // API 안됌, 일단 mail api는 보류!
    Axios.post(API.sendMail, {
      user_id: 'rmrm',
      rm_id: 'linkedin_1',
      sender:'rmrm.help@gmail.com',
      recipient:'sungunkim367@gmail.com',
      subject:'test_subject',
      body:'test_body'
    })
  }
    
  render() {
    return (
      <div>
        <Button
            type='primary'
            icon='mail'
            onClick={this.sendMail}
          >
            Follow up
          </Button>
        <Table
          columns={columns}
          // rowKey={record => record.login.uuid}
          bordered
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
