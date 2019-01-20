import React, { Component } from 'react'
import Axios from 'axios'
import API from '../../util/api'
import JobForm from '../forms/JobForm'
import { 
  Button,
  Divider,
  Form,
  message,
  Modal,
  Popconfirm,
  Table,
  Tag } from 'antd'

const columns = [{
	title: '포지션 제목',
	dataIndex: 'title'
}, {
	title: '포지션 회사',
  dataIndex: 'company',
}, {
	title: '키워드',
  dataIndex: 'keyword',
  render: (e) => (
    <span>
      {e.split(', ').map(tag => <Tag color="blue">{tag}</Tag>)}
    </span>
  )
}, {
	title: '등록일시',
	dataIndex: '',
}, {
	title: 'Status',
	dataIndex: ''
}];

const rowSelection = {
	onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
	},
	getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
		name: record.name
	}),
};

export default class Job extends Component {
	state = {
    loading: true,
    data: [],
		pagination: {},
		visible: false
	}
	
	componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    Axios.post(API.getPosition, {
      user_id: 'rmrm'
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
	
	handleDeleteConfirm = (e) => {
		message.success('Deleted!')
	}

	handleDeleteCancel = (e) => {
		message.error('Delete canceled.')
	}

	jobModal = () => (
    <div>
      <Modal
        title=''
        visible={this.state.visible}
        onOk={this.handleModalOk}
        onCancel={this.handleModalCancel}
      >
      <JobForm.JobRegistration />
      
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
    return (
      <div>
				<Popconfirm title='Are you sure you want to delete this?'
					onConfirm={this.handleDeleteConfirm} 
					onCancel={this.handleDeleteCancel}
					okText="OK"
					cancelText="Cancel">
    			<a href="#">삭제</a>
  			</Popconfirm>
				<a> | </a>
				<a href="#" onClick={this.showModal}>등록</a>
				<this.jobModal />
        <Table
          columns={columns}
          // rowKey={record => record.login.uuid}
          size='small'
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
