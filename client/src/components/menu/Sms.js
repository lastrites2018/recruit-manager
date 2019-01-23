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

export default class SMS extends Component {
  state = {
    loading: true,
    data: [],
    pagination: {},
    selectedRowKeys: [],
    selectedRows: []
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    Axios.post(API.getSMS, {
      user_id: 'rmrm',
      rm_code: '*'
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

  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    this.setState({ selectedRowKeys: selectedRowKeys, selectedRows: selectedRows })
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

  sendSMS = async () => {
    await console.log('selected rows: ', this.state.selectedRowKeys)
    await console.log('preparing to send')
    if (this.state.selectedRowKeys.length === 1) {
      try {
        await Axios.post(API.sendSMS, {
          user_id: 'rmrm',
          rm_code: this.state.selectedRowKeys[0],
          recipent: '01072214890',
          body: 'single text',
          position: 'KT|자연어처리'
        })
        await alert(`문자를 보냈습니다.`)
        await this.resetSelections()
      } catch(err) {
        console.log('send one SMS error', err)
      }
    } else {
      try {
        for (let i = 0; i < this.state.selectedRowKeys.length; i++) {
          await setTimeout(() => {
            Axios.post(API.sendSMS, {
              user_id: 'rmrm',
              rm_code: this.state.selectedRowKeys[i],
              recipent: '01072214890',
              body: `multiple texts${i}`,
              position: 'KT|자연어처리'
            })
          }, 100)
        }
        await alert(`문자를 보냈습니다.`)
        await this.resetSelections()
      } catch (err) {
        console.log('sending multiple SMS error', err)
      }
    }
  }

  resetSelections = () => {
    setTimeout(() => {
      console.log('resetting row selection')
      this.setState({
        selectedRowKeys: [],
        selectedRows: []
      })
    }, 2000)
  }
    
  render() {
    const rowSelection = {
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    }

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
