import React, { Component } from 'react'
import Axios from 'axios'
import API from '../../util/api'
import SmsForm from '../forms/SmsForm'
import { Modal, Table, Input, Button, Icon } from 'antd'
import Highlighter from 'react-highlight-words'

export default class SMS extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      data: [],
      pagination: {},
      selectedRowKeys: [],
      selectedRows: [],
      sms: {},
      visible: false,
      searchText: ''
    }

    this.columns = [
      {
        title: '수신인',
        dataIndex: 'name',
        render: e => <a href="javascript:">{e}</a>,
        ...this.getColumnSearchProps('name')
      },
      {
        title: '발송시간',
        dataIndex: 'modified_date',
        // dataIndex: 'send_date',
        sorter: true,
        ...this.getColumnSearchProps('modified_date')
      },
      {
        title: 'Client',
        dataIndex: 'client',
        ...this.getColumnSearchProps('client')
      },
      {
        title: 'Position',
        dataIndex: 'position',
        ...this.getColumnSearchProps('position')
      },
      {
        title: 'Content',
        dataIndex: 'body',
        ...this.getColumnSearchProps('body')
      },
      {
        title: '수신확인',
        dataIndex: '수신확인',
        ...this.getColumnSearchProps('수신확인')
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
          textToHighlight={text.toString()}
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
    Axios.post(API.getSMS, {
      user_id: this.props.user_id,
      rm_code: '*'
    }).then(data => {
      const pagination = { ...this.state.pagination }
      // Read total count from server
      // pagination.total = data.totalCount
      this.setState({
        loading: false,
        data: data.data.result.reverse(),
        pagination
      })
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

  showModal = () => {
    this.setState({ visible: true })
  }

  handleOk = () => {
    this.setState({ visible: false })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  // writeSmsContent = form => {
  //   this.setState({ sms: form })
  //   this.sendSMS()
  //   this.handleCancel()
  //   this.resetSelections()
  // }

  writeSmsContent = async form => {
    await this.setState({ sms: form })
    await this.sendSMS()
    await this.handleCancel()
    await this.resetSelections()
  }

  resetSelections = () => {
    setTimeout(() => {
      console.log('sms-resetting row selection')
      this.setState({
        selectedRowKeys: [],
        selectedRows: []
      })
    }, 1000)
  }

  smsModal = () => {
    let title
    if (this.state.selectedRows.length === 0) {
      title = 'SMS'
    } else {
      this.state.selectedRows.length > 1
        ? (title = `SMS ${this.state.selectedRows[0].mobile} 외`)
        : (title = `SMS ${this.state.selectedRows[0].mobile}`)
    }

    return (
      <div>
        <Modal
          title={title}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <SmsForm.SmsRegistration
            selectedRows={this.state.selectedRows}
            writeSmsContent={this.writeSmsContent}
          />
        </Modal>
      </div>
    )
  }

  sendSMS = async () => {
    await console.log('state', this.state.sms)
    await console.log('selected rows: ', this.state.selectedRowKeys)
    await console.log('preparing to send')
    if (this.state.selectedRowKeys.length === 1) {
      try {
        await Axios.post(API.sendSMS, {
          user_id: this.props.user_id,
          rm_code: this.state.selectedRowKeys[0],
          recipient: this.state.selectedRows[0].recipient,
          body: this.state.sms.content,
          position: ''
        })
        await console.log(`문자를 보냈습니다.`)
        await this.resetSelections()
      } catch (err) {
        console.log('send one SMS error', err)
      }
    } else {
      try {
        for (let i = 0; i < this.state.selectedRowKeys.length; i++) {
          await setTimeout(() => {
            Axios.post(API.sendSMS, {
              user_id: this.props.user_id,
              rm_code: this.state.selectedRowKeys[i],
              recipient: this.state.selectedRows[i].recipient,
              body: this.state.sms.content,
              position: ''
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

  resetSelections = async () => {
    await this.setState({
      selectedRowKeys: [],
      selectedRows: []
    })
    await console.log('resetting row selection')
  }

  render() {
    const { visible } = this.state
    const rowSelection = {
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name
      })
    }

    return (
      <div style={{ marginLeft: '20px' }}>
        <Button
          type="primary"
          icon="message"
          onClick={this.showModal}
          style={{ marginTop: '10px' }}
          // onClick={this.sendSMS}
        >
          Follow up
        </Button>
        <Table
          columns={this.columns}
          // rowKey={record => record.login.uuid}
          bordered
          style={{ marginTop: '16px', width: '85%' }}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
          rowSelection={rowSelection}
        />
        {visible && <this.smsModal />}
      </div>
    )
  }
}
