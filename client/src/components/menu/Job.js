import React, { Component } from 'react'
import Axios from 'axios'
import API from '../../util/api'
import JobForm from '../forms/JobForm'
import {
  // Button,
  message,
  Modal,
  Popconfirm,
  Table,
  Tag
} from 'antd'

const columns = [
  {
    title: '포지션 제목',
    dataIndex: 'title'
  },
  {
    title: '포지션 회사',
    dataIndex: 'company'
  },
  {
    title: '키워드',
    dataIndex: 'keyword',
    render: e => (
      <span>
        {e.split(', ').map(tag => (
          <Tag color="blue">{tag}</Tag>
        ))}
      </span>
    )
  },
  {
    title: '등록일시',
    dataIndex: ''
  },
  {
    title: 'Status',
    dataIndex: ''
  }
]

export default class Job extends Component {
  state = {
    loading: true,
    data: [],
    pagination: {},
    selectedRowKeys: [],
    selectedRows: [],
    visible: false
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    Axios.post(API.getPosition, {
      user_id: this.props.user_id
    }).then(data => {
      const pagination = { ...this.state.pagination }
      // Read total count from server
      // pagination.total = data.totalCount
      this.setState({
        loading: false,
        data: data.data.result,
        pagination
      })
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager
    })
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    })
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    this.setState({ selectedRowKeys: selectedRowKeys, selectedRows: selectedRows })
  }

  resetSelections = () => {
    setTimeout(() => {
      console.log('resetting row selection')
      this.setState({
        selectedRowKeys: []
      })
    }, 2000)
  }

  handleDeleteConfirm = async e => {
    await Axios.post(API.deletePosition, {
      user_id: this.props.user_id,
      position_id: this.state.selectedRows[0].position_id,
      valid: 'false'
    })
    await message.success('Deleted!')
    await this.resetSelections()
  }

  handleDeleteCancel = e => {
    message.error('Delete canceled.')
  }

  jobModal = () => (
    <div>
      <Modal
        title=""
        visible={this.state.visible}
        onOk={this.handleModalOk}
        onCancel={this.handleModalCancel}
        footer={null}
      >
        <JobForm.JobRegistration 
          user_id={this.props.user_id}
          close={this.handleModalCancel}
        />
      </Modal>
    </div>
  )

  showModal = () => {
    this.setState({ visible: true })
  }

  handleModalOk = () => {
    this.setState({ visible: false })
  }

  handleModalCancel = () => {
    this.setState({ visible: false })
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
        <Popconfirm
          title="Are you sure you want to delete this?"
          onConfirm={this.handleDeleteConfirm}
          onCancel={this.handleDeleteCancel}
          okText="OK"
          cancelText="Cancel"
        >
          <a href="#">삭제</a>
        </Popconfirm>
        <a> | </a>
        <a href="#" onClick={this.showModal}>
          등록
        </a>
        <this.jobModal />
        <Table
          columns={columns}
          // rowKey={record => record.login.uuid}
          size="small"
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
