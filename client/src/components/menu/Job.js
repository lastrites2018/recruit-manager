import React, { Component } from 'react'
import Axios from 'axios'
import API from '../../util/api'
import JobForm from '../forms/JobForm'
import UpdateJobForm from '../forms/UpdateJobForm'
import {
  message,
  Modal,
  Popconfirm,
  Table,
  Tag,
  Input,
  Button,
  Icon
} from 'antd'
import Highlighter from 'react-highlight-words'

export default class Job extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      data: [],
      pagination: {},
      selectedRowKeys: [],
      selectedRows: [],
      visible: false,
      updateVisible: false
    }

    this.columns = [
      {
        title: '포지션 제목',
        dataIndex: 'title',
        width: '15%',
        ...this.getColumnSearchProps('title')
      },
      {
        title: '포지션 회사',
        dataIndex: 'company',
        width: '15%',
        ...this.getColumnSearchProps('company')
      },
      {
        title: '포지션 상세',
        dataIndex: 'detail',
        width: '100',
        ...this.getColumnSearchProps('detail')
      },
      {
        title: '키워드',
        dataIndex: 'keyword',
        ...this.getColumnSearchProps('keyword'),
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
        dataIndex: 'modified_date',
        width: '100',
        ...this.getColumnSearchProps('modified_date')
      },
      {
        title: 'Status',
        dataIndex: 'valid'
      }
    ]
  }
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select())
      }
    },
    render: text =>
      text ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text && text.toString()}
        />
      ) : null
  })

  handleSearch = (selectedKeys, confirm) => {
    confirm()
    this.setState({ searchText: selectedKeys[0] })
  }

  handleReset = clearFilters => {
    clearFilters()
    this.setState({ searchText: '' })
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
      console.log('job', data.data.result)
      this.setState({
        loading: false,
        data: data.data.result.reverse(),
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
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows
    )
    this.setState({
      selectedRowKeys: selectedRowKeys,
      selectedRows: selectedRows
    })
  }

  resetSelections = () => {
    setTimeout(() => {
      console.log('job-resetting row selection')
      this.setState({
        selectedRowKeys: []
      })
    }, 2000)
  }

  handleDeleteConfirm = async e => {
    await e.preventDefault()
    if (this.state.selectedRows.length === 1) {
      try {
        await Axios.post(API.deletePosition, {
          user_id: this.props.user_id,
          position_id: this.state.selectedRows[0].position_id,
          valid: 'expired'
        })
        await message.success(
          `${this.state.selectedRows[0].company} | ${
            this.state.selectedRows[0].title
          } 포지션이 삭제되었습니다.`
        )
        await this.fetch()
      } catch (err) {
        await message.error('failed to delete a position', err)
      }
    } else {
      try {
        let deletedPositions = []
        for (let i = 0; i < this.state.selectedRows.length; i++) {
          await deletedPositions.push(
            `${this.state.selectedRows[i].company} | ${
              this.state.selectedRows[i].title
            }`
          )
          await Axios.post(API.deletePosition, {
            user_id: this.props.user_id,
            position_id: this.state.selectedRows[i].position_id,
            valid: 'expired'
          })
        }
        await message.success(
          `${deletedPositions.join(', ')} 포지션이 삭제되었습니다.`
        )
        await this.fetch()
      } catch (err) {
        await message.error('failed to delete positions', err)
      }
    }
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
          selected={this.state.selectedRows}
          user_id={this.props.user_id}
          close={this.handleModalCancel}
          jobFetch={this.fetch}
        />
      </Modal>
    </div>
  )

  updateJobModal = () => (
    <div>
      <Modal
        title=""
        visible={this.state.updateVisible}
        onOk={this.handleUpdateModalOk}
        onCancel={this.handleUpdateModalCancel}
        footer={null}
      >
        <UpdateJobForm.UpdateJobRegistration
          user_id={this.props.user_id}
          close={this.handleUpdateModalCancel}
          selected={this.state.selectedRows[0]}
          jobFetch={this.fetch}
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
    this.setState({ visible: false, selectedRowKeys: [] })
  }

  showUpdateModal = () => {
    this.setState({ updateVisible: true })
  }

  handleUpdateModalOk = () => {
    this.setState({ updateVisible: false })
  }

  handleUpdateModalCancel = () => {
    this.setState({ updateVisible: false, selectedRowKeys: [] })
  }

  render() {
    const rowSelection = {
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name
      })
    }

    return (
      <div style={{ marginLeft: '20px' }}>
        <div style={{ marginTop: '16px', width: '85%' }}>
          <Button
            style={{ marginRight: 5, marginBottom: 16 }}
            type="primary"
            icon="user-add"
            onClick={this.showModal}
          >
            등록
          </Button>

          <Popconfirm
            title="Are you sure you want to delete this?"
            onConfirm={this.handleDeleteConfirm}
            onCancel={this.handleDeleteCancel}
            okText="OK"
            cancelText="Cancel"
          >
            <Button
              type="primary"
              icon="delete"
              style={{ marginRight: 5, marginBottom: 16 }}
            >
              삭제
            </Button>
          </Popconfirm>

          <Button
            type="primary"
            icon="edit"
            onClick={this.showUpdateModal}
            style={{ marginRight: 5, marginBottom: 16 }}
          >
            편집
          </Button>
        </div>

        <this.jobModal />
        <this.updateJobModal />
        <Table
          columns={this.columns}
          rowKey="position_id"
          size="small"
          style={{ marginTop: '10px', width: '95%' }}
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
