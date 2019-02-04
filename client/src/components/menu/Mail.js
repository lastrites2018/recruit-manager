import React, { Component } from 'react'
import Axios from 'axios'
import API from '../../util/api'
import MailForm from '../forms/MailForm'
import { Button, Col, Divider, Icon, Input, Modal, Table, Row } from 'antd'
import Highlighter from 'react-highlight-words'
import { sortBy } from 'lodash'

export default class Mail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allRecipients: [],
      allEmails: [],
      loading: true,
      data: [],
      mail: {},
      mailDetail: {},
      mailDetailTitle: '',
      pagination: {},
      selectedRowKeys: [],
      selectedRows: [],
      detailVisible: false,
      visible: false,
      searchText: ''
    }
    this.columns = [
      {
        title: '수신인',
        dataIndex: 'name',
        render: text => <a href="javascript:">{text}</a>,
        width: '15%',
        align: 'center',
        ...this.getColumnSearchProps('name')
      },
      {
        title: '발송시간',
        dataIndex: 'modified_date',
        // dataIndex: 'send_date',
        sorter: true,
        width: '110px',
        align: 'center',
        ...this.getColumnSearchProps('modified_date')
      },
      {
        title: 'Client',
        dataIndex: 'client',
        width: '50px',
        align: 'center',
        ...this.getColumnSearchProps('client')
      },
      {
        title: 'Position',
        dataIndex: 'position',
        width: '50px',
        align: 'center',
        ...this.getColumnSearchProps('position')
      },
      {
        title: '수신확인',
        dataIndex: '수신확인',
        width: '100px',
        align: 'center',
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
    Axios.post(API.getMail, {
      user_id: this.props.user_id,
      rm_code: '*'
    }).then(data => {
      const pagination = { ...this.state.pagination }
      // Read total count from server
      // pagination.total = data.totalCount
      console.log('mail-fetch', data.data.result)
      const mailSort = sortBy(data.data.result, [
        function(mail) {
          return Number(mail.mail_id.slice(5))
        }
      ])
      this.setState({
        loading: false,
        data: mailSort.reverse(),
        pagination
      })
    })
  }

  onSelectChange = async (selectedRowKeys, selectedRows) => {
    await console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows
    )
    await this.setState({
      selectedRowKeys: selectedRowKeys,
      selectedRows: selectedRows
    })
    await this.getAllRecipients()
  }

  getAllRecipients = () => {
    let allRecipients = [],
      allEmails = []
    for (let i = 0; i < this.state.selectedRows.length; i++) {
      allRecipients.push(this.state.selectedRows[i].name)
      allEmails.push(this.state.selectedRows[i].recipient)
    }
    this.setState({ allRecipients, allEmails })
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

  mailModal = () => (
    <div>
      <Modal
        title="Mail"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={null}
      >
        <MailForm.MailRegistration
          mail={this.writeMailContent}
          allRecipients={this.state.allRecipients}
          allEmails={this.state.allEmails}
        />
      </Modal>
    </div>
  )

  mailDetailModal = () => (
    <div>
      <Modal
        title={this.state.mailDetailTitle}
        visible={this.state.detailVisible}
        onOK={this.handleDetailOK}
        onCancel={this.handleDetailCancel}
        footer={null}
        width="50%"
      >
        <Row style={{ textAlign: 'left' }}>
          <Col span={18}>
            <h3>[ Send Content ]</h3>
          </Col>
        </Row>
        <Row style={{ textAlign: 'left' }}>
          <Col span={18}>
            <p>{this.state.mailDetail.body}</p>
          </Col>
        </Row>
        <Divider />
        <Row style={{ textAlign: 'left' }}>
          <Col span={18}>
            <h3>[ Send Date ]</h3>
          </Col>
        </Row>
        <Row style={{ textAlign: 'left' }}>
          <Col span={18}>
            <p>{this.state.mailDetail.send_date}</p>
          </Col>
        </Row>
      </Modal>
    </div>
  )

  showDetailModal = () => {
    console.log('show mail detail modal')
    this.setState({ detailVisible: true })
  }

  handleDetailOk = () => {
    this.setState({ detailVisible: false })
  }

  handleDetailCancel = () => {
    this.setState({ detailVisible: false })
  }

  showModal = () => {
    console.log('show modal')
    this.setState({ visible: true })
  }

  handleOk = () => {
    this.setState({ visible: false })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  writeMailContent = form => {
    this.setState({ mail: form })
    this.sendMail()
    this.handleCancel()
  }

  sendMail = async () => {
    await console.log('selected rows: ', this.state.selectedRows)
    await console.log('preparing to send')
    if (this.state.selectedRows.length === 1) {
      try {
        await this.setState({ loading: true })
        await Axios.post(API.sendMail, {
          user_id: this.props.user_id,
          rm_code: this.state.selectedRows[0].rm_code,
          sender: 'rmrm@careersherpa.co.kr',
          // recipient: 'joinsusang@gmail.com',
          recipient: this.state.selectedRows[0].recipient,
          subject: this.state.mail.title,
          body:
            this.state.mail.content +
            '\n\n' +
            '[Position Detail]\n\n' +
            this.state.mail.position_detail +
            '\n\n' +
            this.state.mail.sign,
          position: '' // 공백이라도 보내야 함.
        })
          .then(data => {
            console.log('data', data)
          })
          .catch(err => {
            console.log(err.response)
          })
        await this.setState({ loading: false })
        await alert(`메일을 보냈습니다.`)
        // await this.resetSelections()
      } catch (err) {
        console.log('send one email error', err)
      }
    } else {
      try {
        console.log(this.state.selectedRowKeys, this.state.selectedRows)
        for (let i = 0; i < this.state.selectedRows.length; i++) {
          await setTimeout(() => {
            Axios.post(API.sendMail, {
              user_id: this.props.user_id,
              rm_code: this.state.selectedRows[i].rm_code,
              sender: 'rmrm.help@gmail.com',
              recipient: this.state.selectedRows[i].recipient,
              subject: this.state.mail.title,
              body:
                this.state.mail.content +
                '\n\n' +
                this.state.mail.position_detail +
                '\n\n' +
                this.state.mail.sign,
              position: ''
            })
          }, 100)
        }
        await alert(`메일을 보냈습니다.`)
        // await this.resetSelections()
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
        name: record.name
      })
    }
    const { visible, detailVisible } = this.state

    return (
      <div style={{ marginLeft: '20px' }}>
        <Button
          type="primary"
          icon="mail"
          onClick={this.showModal}
          disabled={!this.state.selectedRows.length}
          style={{ marginTop: '10px' }}
          // onClick={this.sendMail}
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
          onRow={record => ({
            onClick: () => {
              console.log('record', record)
              this.setState({
                mailDetail: record,
                mailDetailTitle: `${record.name} | ${record.recipient}`
              })
              this.showDetailModal()
            }
          })}
        />
        {visible && <this.mailModal />}
        {detailVisible && <this.mailDetailModal />}
      </div>
    )
  }
}
