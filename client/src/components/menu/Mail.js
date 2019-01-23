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

export default class Mail extends Component {
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
    Axios.post(API.getMail, {
      user_id: this.props.user_id,
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

  sendMail = async () => {
    await console.log('selected rows: ', this.state.selectedRows)
    await console.log('preparing to send')
    if (this.state.selectedRows.length === 1) {
      try {
        await Axios.post(API.sendMail, {
          user_id: this.props.user_id,
          rm_code: this.state.selectedRows[0].rm_code,
          sender: 'rmrm.help@gmail.com',
          recipent: 'sunnykim367@gmail.com',
          subject: 'single mail',
          body: 'single mail'
        })
        await alert(`메일을 보냈습니다.`)
        await this.resetSelections()
      } catch(err) {
        console.log('send one email error', err)
      }
    } else {
      try {
        for (let i = 0; i < this.state.selectedRows.length; i++) {
          await setTimeout(() => {
            Axios.post(API.sendMail, {
              user_id: this.props.user_id,
              rm_code: this.state.selectedRows[i].rm_code,
              sender: 'rmrm.help@gmail.com',
              recipent: 'sunnykim367@gmail.com',
              subject: `multiple${i}`,
              body: `multiple${i}`
            })
          }, 100)
        }
        await alert(`메일을 보냈습니다.`)
        await this.resetSelections()
      } catch (err) {
        console.log('send multiple emails error', err)
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
