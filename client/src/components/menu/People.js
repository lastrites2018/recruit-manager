import React, { Component } from 'react'
import Axios from 'axios'
import API from '../../util/api'
import ResumeForm from '../forms/ResumeForm'
import UpdateResumeForm from '../forms/UpdateResumeForm'
import MailForm from '../forms/MailForm'
import SmsForm from '../forms/SmsForm'
import { EditableFormRow, EditableCell } from '../../util/Table'
import 'react-table/react-table.css'
import './menu.css'
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Icon,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table
} from 'antd'
import Highlighter from 'react-highlight-words'

export default class People extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allRecipients: [],
      allEmails: [],
      mail: {},
      minAge: '',
      maxAge: '',
      isTopSchool: false,
      position: '',
      dataSource: [],
      nextSource: {},
      selectedRowKeys: [],
      selectedRows: [],
      manualKey: 0, // will need to change this later
      clickedData: [],
      visible: false,
      visibleNewResume: false,
      newResume: {},
      visibleUpdateResume: false,
      resumeDetailData: [],
      resumeDetailTitle: '',
      mailVisible: false,
      phoneNumber: '',
      sms: {},
      smsVisible: false,
      searchText: '',
      selected: '',
      andOr: '',
      positionData: [],
      searchCount: 0,
      currentKey: null
    }

    this.columns = [
      {
        key: 'name',
        title: '이름',
        dataIndex: 'name',
        align: 'center',
        ...this.getColumnSearchProps('name')
      },
      {
        key: 'age',
        title: '나이',
        dataIndex: 'age',
        width: 75,
        align: 'center',
        ...this.getColumnSearchProps('age')
      },
      {
        key: 'school',
        title: '최종학력',
        dataIndex: 'school',
        align: 'center',
        ...this.getColumnSearchProps('school')
      },
      {
        key: 'company',
        title: '주요직장',
        dataIndex: 'company',
        align: 'center',
        ...this.getColumnSearchProps('company')
      },
      {
        key: 'career',
        title: '총 경력',
        dataIndex: 'career',
        align: 'center',
        ...this.getColumnSearchProps('career')
      },
      {
        key: 'keyword',
        title: '핵심 키워드',
        dataIndex: 'keyword',
        align: 'center',
        ...this.getColumnSearchProps('keyword')
      },
      {
        key: 'resume_title',
        title: 'Resume Title',
        dataIndex: 'resume_title',
        align: 'center',
        width: 130,
        ...this.getColumnSearchProps('resume_title')
      },
      {
        key: 'salary',
        title: '연봉',
        dataIndex: 'salary',
        width: 120,
        ...this.getColumnSearchProps('salary')
      },
      {
        key: 'rate',
        title: 'Rate',
        dataIndex: 'rate',
        sorter: (a, b) => a.rate - b.rate,
        sortOrder: 'descend',
        width: 60,
        align: 'center',
        ...this.getColumnSearchProps('rate')
      },
      {
        key: 'url',
        title: 'URL',
        dataIndex: 'url',
        width: 50,
        render: (text, row, index) => {
          return (
            <a href={text} target="_blank" onClick={this.handleCancel}>
              URL
            </a>
          )
        }
      },
      {
        key: 'modified_date', //날짜에 맞게 데이터 맞게 들어왔는지 확인용
        title: '등록 날짜(테스트용)',
        dataIndex: 'modified_date',
        width: 120,
        ...this.getColumnSearchProps('modified_date')
      }
      // {
      //   title: 'Action',
      //   dataIndex: '',
      //   // 이건 나중에 지워서 breadcrumb 으로 만들기
      //   // row 삭제 api 필요 예) delete/rm_code/10 이런식
      //   // 현재 row onClick 하면 모달이랑 같이 뜸.
      //   render: (text, record) =>
      //     this.state.dataSource.length >= 1 ? (
      //       <Popconfirm
      //         title="삭제?"
      //         onConfirm={() => this.handleDelete(record.key)}
      //       >
      //         <a href="javascript:">삭제</a>
      //       </Popconfirm>
      //     ) : null
      // }
    ]
  }

  showMailModal = () => {
    this.setState({ mailVisible: true })
  }

  handleMailOk = () => {
    this.setState({ mailVisible: false })
  }

  handleMailCancel = () => {
    this.setState({ mailVisible: false })
  }

  writeMailContent = form => {
    this.setState({ mail: form })
    this.sendMail()
    this.handleMailCancel()
  }

  mailModal = () => (
    <div>
      <Modal
        title="Mail"
        visible={this.state.mailVisible}
        onOk={this.handleMailOk}
        onCancel={this.handleMailCancel}
        footer={null}
      >
        <MailForm.MailRegistration
          selectedRows={this.state.selectedRows}
          mail={this.writeMailContent}
          // positionData={this.state.positionData} 중복
          allRecipients={this.state.allRecipients}
          allEmails={this.state.allEmails}
        />
      </Modal>
    </div>
  )

  success = msg => {
    message.success(msg)
  }

  getAllRecipients = () => {
    let allRecipients = [],
      allEmails = []
    for (let i = 0; i < this.state.selectedRows.length; i++) {
      allRecipients.push(this.state.selectedRows[i].name)
      allEmails.push(this.state.selectedRows[i].email)
    }
    this.setState({ allRecipients, allEmails })
  }

  sendMail = async () => {
    await console.log(this.state.selectedRowKey, this.state.selectedRows)
    await console.log('preparing to send')
    if (this.state.selectedRowKeys.length === 1) {
      try {
        await Axios.post(API.sendMail, {
          user_id: this.props.user_id,
          rm_code: this.state.selectedRows[0].rm_code,
          sender: 'rmrm.help@gmail.com',
          recipient: this.state.selectedRows[0].email,
          subject: this.state.mail.title,
          body:
            this.state.mail.content +
            '\n\n' +
            '[Position Detail]: ' +
            this.state.mail.position_detail +
            '\n\n' +
            this.state.mail.sign,
          position: ''
        })
        await this.success(
          `메일을 ${this.state.selectedRows[0].name} 님에게 보냈습니다.`
        )
        // await this.resetSelections()
      } catch (err) {
        console.log('send one email error', err)
      }
    } else {
      try {
        let listOfRecipients = []
        for (let i = 0; i < this.state.selectedRowKeys.length; i++) {
          await setTimeout(() => {
            Axios.post(API.sendMail, {
              user_id: this.props.user_id,
              rm_code: this.state.selectedRows[i].rm_code,
              sender: 'rmrm.help@gmail.com',
              recipient: this.state.selectedRows[i].email,
              subject: this.state.mail.title,
              body: this.state.mail.content,
              position: ''
            })
          }, 100)
        }
        for (let j = 0; j < this.state.selectedRows.length; j++) {
          await listOfRecipients.push(this.state.selectedRows[j].name)
        }
        await alert(
          `메일을 ${listOfRecipients.join(' 님, ')} 님에게 보냈습니다.`
        )
        // await this.resetSelections()
      } catch (err) {
        console.log('send multiple emails error', err)
      }
    }
  }

  showSmsModal = () => {
    console.log('showSmsModal', this.state.selectedRows[0].mobile)
    this.state.selectedRows[0].mobile &&
    this.state.selectedRows[0].mobile !== 'null'
      ? this.setState({ smsVisible: true })
      : message.error('폰 번호가 등록되지 않은 이력서입니다.')
  }

  handleSmsOk = () => {
    this.setState({ smsVisible: false })
  }

  handleSmsCancel = () => {
    this.setState({ smsVisible: false })
  }

  writeSmsContent = form => {
    this.setState({ sms: form })
    this.sendSMS()
    this.handleSmsCancel()
  }

  smsModal = () => {
    // let receiversMobileNumber =
    //   this.state.selectedRows.length > 1
    //     ? this.state.selectedRows.map((row, index) => row.mobile).join(',')
    //     : null

    return (
      <div>
        <Modal
          title={
            this.state.selectedRows.length > 1
              ? `SMS ${this.state.selectedRows[0].mobile} 외`
              : `SMS ${this.state.selectedRows[0].mobile}`
          }
          // title="SMS"
          visible={this.state.smsVisible}
          onOk={this.handleSmsOk}
          onCancel={this.handleSmsCancel}
          footer={null}
        >
          <SmsForm.SmsRegistration
            selectedRows={this.state.selectedRows}
            sms={this.writeSmsContent}
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
          recipient: this.state.selectedRows[0].mobile,
          body: this.state.sms.content,
          position: ''
        })
        await console.log(`문자를 보냈습니다.`)
        // await this.resetSelections()
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
              recipient: this.state.selectedRows[i].mobile,
              body: this.state.sms.content,
              position: ''
            })
          }, 100)
        }
        await alert(`문자를 보냈습니다.`)
        // await this.resetSelections()
      } catch (err) {
        console.log('sending multiple SMS error', err)
      }
    }
  }

  resetSelections = () => {
    setTimeout(() => {
      console.log('resetting row selection')
      this.setState({
        selectedRowKeys: []
      })
    }, 2000)
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

  async getResumeDetail(rm_code) {
    if (rm_code) {
      await Axios.post(API.rmDetail, {
        user_id: this.props.user_id,
        rm_code: this.state.clickedData.rm_code
      })
        .then(res => {
          console.log('getResumeDetail_res', res.data.result)
          this.setState({
            resumeDetailData: res.data.result
          })
        })
        .catch(err => {
          console.log(err.response)
        })
    }
  }

  handleClick = async clickedData => {
    await this.setState({ clickedData })
    await this.setState({
      resumeDetailTitle: `${this.state.clickedData.name} | ${
        this.state.clickedData.age
      } | ${this.state.clickedData.gender} | ${
        this.state.clickedData.mobile
      } | ${this.state.clickedData.email}`
    })

    await this.getResumeDetail(clickedData.rm_code)
    await this.showModal()
  }

  fetch = () => {
    Axios.post(API.mainTable, {
      user_id: this.props.user_id,
      under_age: 0,
      upper_age: 90,
      top_school: false,
      keyword: ''
    }).then(data => {
      const pagination = { ...this.state.pagination }
      // Read total count from server
      // pagination.total = data.totalCount
      pagination.total = 200

      const result = data.data.result.reverse().map((row, i) => {
        const each = Object.assign({}, row)
        each.key = i
        return each
      })
      this.setState({
        dataSource: result,
        pagination
      })
    })
  }

  fetchPosition = () => {
    Axios.post(API.getPosition, {
      user_id: this.props.user_id
    }).then(data => {
      this.setState({
        positionData: data.data.result
      })
    })
  }

  //send input data
  fetchAgain = () => {
    const { minAge, maxAge, isTopSchool, position, andOr } = this.state
    let unitedSearch = ''
    let positionSplit = ''

    if (position && position.includes(' ')) {
      positionSplit = position.split(' ').join('||')
    } else {
      positionSplit = position
    }

    if (positionSplit && andOr) {
      unitedSearch = `${positionSplit}||${andOr}`
    } else if (positionSplit) {
      unitedSearch = positionSplit
    } else if (andOr) {
      unitedSearch = andOr
    }

    console.log('unitedSearch', unitedSearch)
    Axios.post(API.viewMainTablePosition, {
      user_id: this.props.user_id,
      under_age: Number(minAge) || 0,
      upper_age: Number(maxAge) || 90,
      top_school: isTopSchool,
      keyword: unitedSearch
      // position: position
      // keyword: andOr
    }).then(data => {
      const pagination = { ...this.state.pagination }
      pagination.total = 200

      const result = data.data.result.reverse().map((row, i) => {
        const each = Object.assign({}, row)
        each.key = i
        return each
      })
      this.setState({
        dataSource: result,
        pagination,
        searchCount: result.length
      })
    })
  }

  checkTopschool = e => {
    console.log(`isTopSchool === ${e.target.checked}`)
    this.setState({ isTopSchool: e.target.checked })
  }

  handlePositionChange = value => {
    this.setState({ position: value })
  }

  handleAgeChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = () => {
    this.fetchAgain()
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource]
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) })
  }

  handleAdd = () => {
    const { count, dataSource, manualKey } = this.state
    const newData = {
      // uniq key 가 필요함 수정 필요!

      // Warning: Each record in table should have a unique `key` prop,
      // or set `rowKey` to an unique primary key.

      rowKey: this.state.manualKey, // unique key 값을 안 준다
      name: 'sunny',
      age: '100',
      school: 'uc berkeley',
      company: 'codestates'
    }
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
      manualKey: manualKey + 1
    })
  }

  handleSave = row => {
    const newData = [...this.state.dataSource]
    const index = newData.findIndex(item => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row
    })
    this.setState({ dataSource: newData })
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

  handleSearchReset = () => {
    this.setState({
      mail: {},
      minAge: '',
      maxAge: '',
      isTopSchool: false,
      position: '',
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      manualKey: 0, // will need to change this later
      clickedData: [],
      visible: false,
      visibleNewResume: false,
      newResume: {},
      resumeDetailData: [],
      mailVisible: false,
      phoneNumber: '',
      sms: {},
      smsVisible: false,
      searchText: '',
      selected: '',
      andOr: '',
      positionData: [],
      searchCount: 0
    })
    this.fetch()
  }

  // handleSelectChange = value => {
  //   this.setState({ selected: value })
  // }

  handleClearSelected = () => {
    this.setState({ position: null })
  }

  onLeftClick = async () => {
    await this.setState({ currentKey: this.state.clickedData.key - 1 })
    for (let i = 0; i < this.state.dataSource.length; i++) {
      if (this.state.dataSource[i].key === this.state.currentKey) {
        await this.setState({ clickedData: this.state.dataSource[i] })
      }
    }
    await this.setState({
      resumeDetailTitle: `${this.state.clickedData.name} ${
        this.state.clickedData.age
      } | ${this.state.clickedData.gender} | ${
        this.state.clickedData.mobile
      } | ${this.state.clickedData.email}`
    })
    await this.getResumeDetail(this.state.clickedData.rm_code)
  }

  onRightClick = async () => {
    await this.setState({ currentKey: this.state.clickedData.key + 1 })
    for (let i = 0; i < this.state.dataSource.length; i++) {
      if (this.state.dataSource[i].key === this.state.currentKey) {
        await this.setState({ clickedData: this.state.dataSource[i] })
      }
    }
    await this.setState({
      resumeDetailTitle: `${this.state.clickedData.name} ${
        this.state.clickedData.age
      } | ${this.state.clickedData.gender} | ${
        this.state.clickedData.mobile
      } | ${this.state.clickedData.email}`
    })
    await this.getResumeDetail(this.state.clickedData.rm_code)
  }

  peopleModal = () => (
    <div>
      <Modal
        title={this.state.resumeDetailTitle}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Row type="flex" justify="center" align="middle">
          <Col span={14}>
            <h3>[ School ]</h3>
          </Col>
        </Row>
        <Row type="flex" justify="center" align="middle">
          <Col span={14}>
            <p>{this.state.resumeDetailData[0].school}</p>
          </Col>
        </Row>
        <Divider />
        <Row type="flex" justify="center" align="middle">
          <Col span={14}>
            <h3>[ Company ]</h3>
          </Col>
        </Row>
        <Row type="flex" justify="center" align="middle">
          <Col span={14}>
            <p>{this.state.resumeDetailData[0].company}</p>
          </Col>
        </Row>
        <Divider />
        <Row type="flex" justify="center" align="middle">
          <Col span={14}>
            <h3>[ Others ]</h3>
          </Col>
        </Row>
        <Row type="flex" justify="center" align="middle">
          <Col span={14}>
            <p>{this.state.resumeDetailData[0].others}</p>
          </Col>
        </Row>
        <Divider />
        <Row type="flex" align="middle">
          <Col span={6}>
            <Button
              type="primary"
              icon="left"
              value="large"
              onClick={this.onLeftClick}
            />
          </Col>
          <Col span={6} offset={12}>
            <Button
              type="primary"
              icon="right"
              value="large"
              onClick={this.onRightClick}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  )

  // memoTable = () => {
  //   //temp

  //   const columns = [
  //     {
  //       title: 'Client',
  //       dataIndex: 'client'
  //     },
  //     {
  //       title: 'Date',
  //       dataIndex: 'date'
  //     },
  //     {
  //       title: 'Text',
  //       dataIndex: 'text'
  //     },
  //     {
  //       title: 'Username',
  //       dataIndex: 'username'
  //     }
  //   ]

  //   console.log('tp', this.state.resumeDetailData[0])

  //   // if (!this.state.resumeDetailData[0].memo) {
  //   //   return
  //   // }

  //   // const datas = this.state.resumeDetailData[0].map(data => {
  //   //   return {
  //   //     client: data.memo.client,
  //   //     date: data.memo.date,
  //   //     position: data.memo.position,
  //   //     text: data.memo.text,
  //   //     username: data.memo.username
  //   //     // memo_client: "강남상사"
  //   //     // memo_date: "2019-01-24"
  //   //     // memo_position: "추천을 하려고 했었음 확인"
  //   //     // memo_text: "경리"
  //   //     // memo_username: "username"
  //   //   }
  //   // })
  //   return (
  //     <div>
  //       <h4>Middle size table</h4>
  //       {/* <Table columns={columns} dataSource={datas} size="middle" />
  //       <h4>Small size table</h4>
  //       <Table columns={columns} dataSource={datas} size="small" /> */}
  //     </div>
  //   )
  // }

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

  handleAndOR = e => {
    let words
    const searchWords = e.target.value
    if (searchWords && searchWords.includes(' ')) {
      words = searchWords.split(' ').join('||')
    } else {
      words = searchWords
    }

    this.setState({ andOr: words })
  }

  filterAndOr = () => {
    // api 기다리는 중
  }

  // handleNewResume = (newResume) => {
  //   this.setState({ newResume: newResume })
  // }

  showAddResumeModal = () => {
    this.setState({ visibleNewResume: true })
  }

  handleAddResumeOk = () => {
    this.setState({ visibleNewResume: false }, () => {
      message.success('A resume has been added!')
    })
  }

  handleAddResumeCancel = () => {
    this.setState({ visibleNewResume: false })
  }

  addResumeModal = () => (
    <div>
      <Modal
        title="레쥬메 등록"
        visible={this.state.visibleNewResume}
        onOk={this.handleAddResumeOk}
        onCancel={this.handleAddResumeCancel}
        footer={null}
      >
        <ResumeForm.ResumeRegistration
          user_id={this.props.user_id}
          close={this.handleAddResumeCancel}
          addSuccess={this.handleAddResumeOk}
          peopleFetch={this.fetch}
        />
      </Modal>
    </div>
  )

  deleteResume = async () => {
    let deletedRecipients = []
    if (this.state.selectedRowKeys.length === 1) {
      try {
        await Axios.post(API.deleteResume, {
          user_id: this.props.user_id,
          rm_code: this.state.selectedRowKeys[0]
        })
        await this.success(
          `${this.state.selectedRows[0].name} 님의 레쥬메를 삭제했습니다.`
        )
        await this.fetch()
        await this.setState({ selectedRowKeys: [], selectedRows: [] })
      } catch (err) {
        console.log('failed to delete to a resume', err)
      }
    } else {
      try {
        for (let i = 0; i < this.state.selectedRowKeys.length; i++) {
          await deletedRecipients.push(this.state.selectedRows[i].name)
          await Axios.post(API.deleteResume, {
            user_id: this.props.user_id,
            rm_code: this.state.selectedRowKeys[i]
          })
        }
        await this.success(
          `${deletedRecipients.join(' 님, ')} 님의 레쥬메를 삭제했습니다.`
        )
        await this.fetch()
        await this.setState({ selectedRowKeys: [], selectedRows: [] })
      } catch (err) {
        console.log('failed to delete resumes', err)
      }
    }
  }

  showUpdateResumeModal = () => {
    this.setState({ visibleUpdateResume: true })
  }

  handleUpdateResumeOk = () => {
    this.setState({ visibleUpdateResume: false }, () => {
      message.success('A resume has been updated!')
    })
  }

  handleUpdateResumeCancel = () => {
    this.setState({ visibleUpdateResume: false })
  }

  updateResumeModal = () => (
    <div>
      <Modal
        title="레쥬메 편집"
        visible={this.state.visibleUpdateResume}
        onOk={this.handleUpdateResumeOk}
        onCancel={this.handleUpdateResumeCancel}
        footer={null}
      >
        <UpdateResumeForm.UpdateResumeRegistration
          user_id={this.props.user_id}
          selected={this.state.selectedRows}
          close={this.handleUpdateResumeCancel}
          addSuccess={this.handleUpdateResumeOk}
          peopleFetch={this.fetch}
        />
      </Modal>
    </div>
  )

  async componentDidMount() {
    await this.fetch()
    await this.fetchPosition()
  }

  render() {
    const InputGroup = Input.Group
    const Option = Select.Option

    const { dataSource, selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    }
    const hasSelected = selectedRowKeys.length > 0
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    }
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      }
    })

    const optionList = this.state.positionData.map((position, index) => (
      <Option value={position.keyword} key={index}>
        {`${position.title}    키워드 : ${position.keyword}`}
      </Option>
    ))

    return (
      <div>
        <br />
        <InputGroup compact>
          <Input
            style={{
              marginLeft: '20px',
              width: '5%'
            }}
            placeholder="min age"
            maxLength={2}
            name="minAge"
            onChange={this.handleAgeChange}
          />
          <Input
            style={{
              width: '5%'
            }}
            placeholder="max age"
            maxLength={2}
            name="maxAge"
            onChange={this.handleAgeChange}
          />
          <Checkbox
            style={{ marginLeft: '30px' }}
            onChange={this.checkTopschool}
          >
            Top School
          </Checkbox>
        </InputGroup>
        <br />
        <Input
          style={{ marginLeft: '20px', width: '20%' }}
          placeholder="검색어 (or)"
          onChange={this.handleAndOR}
        />
        <br />
        <Select
          value={this.state.position}
          showSearch
          style={{ marginTop: '1px', marginLeft: '20px', width: '30%' }}
          optionFilterProp="children"
          onChange={this.handlePositionChange}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {optionList}
        </Select>
        <Button
          style={{ marginLeft: '10px' }}
          type="primary"
          icon="search"
          onClick={this.handleSubmit}
        >
          Search
        </Button>
        <Button
          style={{ marginLeft: '10px' }}
          type="primary"
          onClick={this.handleSearchReset}
        >
          Reset
        </Button>

        <br />
        <div style={{ marginLeft: '20px' }}>
          <br />
          <Button
            type="primary"
            icon="mail"
            onClick={this.showMailModal}
            style={{ marginRight: 5 }}
            disabled={!hasSelected}
          >
            메일
          </Button>
          <Button
            type="primary"
            icon="message"
            onClick={this.showSmsModal}
            style={{ marginRight: 5 }}
            disabled={!hasSelected}
          >
            SMS
          </Button>
          <Button
            type="primary"
            icon="edit"
            onClick={this.showUpdateResumeModal}
            style={{ float: 'right', marginRight: 5, marginBottom: 16 }}
            disabled={!hasSelected}
          >
            편집
          </Button>
          <Button
            type="primary"
            icon="delete"
            onClick={this.deleteResume}
            style={{ float: 'right', marginRight: 5, marginBottom: 16 }}
            disabled={!hasSelected}
          >
            삭제
          </Button>
          <Button
            type="primary"
            icon="user-add"
            onClick={this.showAddResumeModal}
            style={{ float: 'right', marginRight: 5, marginBottom: 16 }}
          >
            등록
          </Button>
          <p style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </p>
          {this.state.searchCount > 0 ? (
            <span>{this.state.searchCount} 개의 검색 결과가 있습니다.</span>
          ) : null}
          <Table
            columns={columns}
            bordered
            style={{ width: '95%' }}
            dataSource={dataSource}
            components={components}
            rowKey="rm_code"
            rowClassName={() => 'editable-row'}
            rowSelection={rowSelection}
            onRow={record => ({
              onClick: () => {
                console.log('record', record)
                this.handleClick(record)
              }
            })}
          />
          {this.state.visible && <this.peopleModal />}
          <this.mailModal />
          {this.state.smsVisible && <this.smsModal />}
          {/* <this.smsModal /> */}
          <this.addResumeModal />
          <this.updateResumeModal />
        </div>
      </div>
    )
  }
}
