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
      under_birth: '',
      upper_birth: '',
      isTopSchool: false,
      positionTitle: '',
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
      currentKey: null,
      loading: true
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
        key: 'birth',
        title: '출생년도',
        dataIndex: 'birth',
        width: 75,
        align: 'center',
        ...this.getColumnSearchProps('birth')
        // render: (text, row, index) => {
        //   // 검색기능과 render를 같이 못 씀 -> 같이 쓸 수 있 지 만 나이 추가 데이터는 검색 안됨
        //   let age
        //   if (text !== 'null' && text) {
        //     let date = new Date()
        //     let year = date.getFullYear()
        //     age = year - Number(text) + 1
        //   }
        //   return (
        //     <span>
        //       {text} 나이 {age}
        //     </span>
        //   )
        // }
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
        key: 'website',
        title: 'WEBSITE',
        dataIndex: 'website',
        align: 'center',
        ...this.getColumnSearchProps('website')
      },
      // {
      //   key: 'email', //날짜에 맞게 데이터 맞게 들어왔는지 확인용
      //   title: 'email(테스트용)',
      //   dataIndex: 'email',
      //   width: 120
      // },
      {
        key: 'modified_date', //날짜에 맞게 데이터 맞게 들어왔는지 확인용
        title: '마지막 수정 일시',
        dataIndex: 'modified_date',
        width: 120,
        ...this.getColumnSearchProps('modified_date')
      }
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
        width="50%"
        visible={this.state.mailVisible}
        onOk={this.handleMailOk}
        onCancel={this.handleMailCancel}
        footer={null}
      >
        <MailForm.MailRegistration
          writeMailContent={this.writeMailContent}
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
          sender: 'rmrm@careersherpa.co.kr',
          recipient: this.state.selectedRows[0].email,
          subject: this.state.mail.title,
          body:
            this.state.mail.content +
            '\n\n' +
            '[Position Detail]\n\n' +
            this.state.mail.position_detail +
            '\n\n' +
            this.state.mail.sign,
          position: `${this.state.mail.positionCompany}|${
            this.state.mail.position
          }`
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
              body:
                this.state.mail.content +
                '\n\n' +
                this.state.mail.position_detail +
                '\n\n' +
                this.state.mail.sign,
              position: `${this.state.mail.positionCompany}|${
                this.state.mail.position
              }` // 공백이라도 보내야 함.
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
    // console.log('showSmsModal', this.state.selectedRows[0].mobile)
    // this.state.selectedRows[0].mobile &&
    // this.state.selectedRows[0].mobile !== 'null'
    //   ? this.setState({ smsVisible: true })
    //   : message.error('폰 번호가 등록되지 않은 이력서입니다.')

    this.setState({ smsVisible: true })
  }

  handleSmsOk = () => {
    this.setState({ smsVisible: false })
  }

  handleSmsCancel = () => {
    this.setState({ smsVisible: false })
  }

  writeSmsContent = form => {
    console.log('people-sms-form', form)
    this.setState({ sms: form })
    this.sendSMS()
    this.handleSmsCancel()
  }

  smsModal = () => {
    // let receiversMobileNumber =
    //   this.state.selectedRows.length > 1
    //     ? this.state.selectedRows.map((row, index) => row.mobile).join(',')
    //     : null

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
          // title="SMS"
          visible={this.state.smsVisible}
          onOk={this.handleSmsOk}
          onCancel={this.handleSmsCancel}
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
    if (this.state.selectedRowKeys.length === 0) {
      try {
        await Axios.post(API.sendSMS, {
          user_id: this.props.user_id,
          rm_code: '',
          recipient: this.state.sms.receiver,
          body: this.state.sms.content,
          position: ''
        })
        await console.log(`${this.state.sms.receiver}에 문자를 보냈습니다.`)
        // await this.resetSelections()
      } catch (err) {
        console.log('send one SMS error', err)
      }
    }

    if (this.state.selectedRowKeys.length === 1) {
      try {
        await Axios.post(API.sendSMS, {
          user_id: this.props.user_id,
          rm_code: this.state.selectedRowKeys[0],
          recipient: this.state.selectedRows[0].mobile,
          body: this.state.sms.content,
          position: `${this.state.sms.positionCompany}|${this.state.sms.select}`
        })
        await console.log(
          `${this.state.selectedRows[0].mobile}에 문자를 보냈습니다.`
        )
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
              position: `${this.state.sms.positionCompany}|${
                this.state.sms.select
              }`
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
    console.log('resetting row selection')
    this.setState({
      selectedRowKeys: []
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

  async getResumeDetail(rm_code) {
    if (rm_code) {
      await Axios.post(API.rmDetail, {
        user_id: this.props.user_id,
        rm_code: this.state.clickedData.rm_code
        // user_id: 'rmrm',
        // rm_code: 'incrute_2017042102318'
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

    const resumeTitle = {
      mobile:
        clickedData.mobile && clickedData.mobile !== 'null'
          ? clickedData.mobile
          : '등록된 번호 없음',
      email:
        clickedData.email && clickedData.email !== 'null'
          ? clickedData.email
          : '등록된 이메일 없음',
      gender:
        clickedData.gender && clickedData.gender !== 'nu'
          ? clickedData.gender
          : '등록된 성별 없음',
      birth:
        clickedData.birth && clickedData.birth !== 'null'
          ? clickedData.birth
          : '등록된 나이 없음',
      name:
        clickedData.name && clickedData.name !== 'null'
          ? clickedData.name
          : '등록된 이름 없음'
    }
    await this.setState({
      resumeDetailTitle: `${resumeTitle.name} | ${resumeTitle.birth} | ${
        resumeTitle.gender
      } | ${resumeTitle.mobile} | ${resumeTitle.email}`
    })

    await this.getResumeDetail(clickedData.rm_code)
    await this.showModal()
  }

  fetch = () => {
    console.log('people-fetch')
    Axios.post(API.mainTable, {
      user_id: this.props.user_id,
      under_birth: 1900,
      upper_birth: 2100,
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
        if (each.url.includes('jobkorea')) each.website = 'jobkorea'
        else if (each.url.includes('saramin')) each.website = 'saramin'
        else if (each.url.includes('linkedin')) each.website = 'linkedin'
        else if (each.url.includes('incruit')) each.website = 'incruit'
        return each
      })
      console.log('fetch-result', result)
      this.setState({
        loading: false,
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
    const {
      under_birth,
      upper_birth,
      isTopSchool,
      positionTitle,
      andOr,
      positionData
    } = this.state
    let unitedSearch = ''
    let positionSplit = ''
    let positionKeyword =
      positionTitle &&
      positionData.filter(data => data.title === positionTitle)[0].keyword

    if (positionKeyword && positionKeyword.includes(' ')) {
      let commaDeletedpositon = positionKeyword.replace(/,/gi, '')
      positionSplit = commaDeletedpositon.split(' ').join('||')
    } else {
      positionSplit = positionKeyword
    }
    console.log('positionSplit', positionSplit)

    if (positionSplit && andOr) {
      unitedSearch = `${positionSplit}||${andOr}`
    } else if (positionSplit) {
      unitedSearch = positionSplit
    } else if (andOr) {
      unitedSearch = andOr
    }

    console.log('unitedSearch', unitedSearch)
    this.setState({ loading: true })
    Axios.post(API.viewMainTablePosition, {
      user_id: this.props.user_id,
      under_birth: Number(under_birth) || 1900,
      upper_birth: Number(upper_birth) || 2400,
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
        loading: false,
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

  handlePositionTitleChange = value => {
    this.setState({ positionTitle: value })
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

  handleSearchReset = async () => {
    await this.setState({
      mail: {},
      under_birth: '',
      upper_birth: '',
      isTopSchool: false,
      positionTitle: '',
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
    await this.fetch()
  }

  onLeftClick = async () => {
    await this.setState({ currentKey: this.state.clickedData.key - 1 })
    for (let i = 0; i < this.state.dataSource.length; i++) {
      if (this.state.dataSource[i].key === this.state.currentKey) {
        await this.setState({ clickedData: this.state.dataSource[i] })
      }
    }
    const { clickedData } = await this.state

    const resumeTitle = await {
      mobile:
        clickedData.mobile && clickedData.mobile !== 'null'
          ? clickedData.mobile
          : '등록된 번호 없음',
      email:
        clickedData.email && clickedData.email !== 'null'
          ? clickedData.email
          : '등록된 이메일 없음',
      gender:
        clickedData.gender && clickedData.gender !== 'nu'
          ? clickedData.gender
          : '등록된 성별 없음',
      birth:
        clickedData.birth && clickedData.birth !== 'null'
          ? clickedData.birth
          : '등록된 나이 없음',
      name:
        clickedData.name && clickedData.name !== 'null'
          ? clickedData.name
          : '등록된 이름 없음'
    }
    await this.setState({
      resumeDetailTitle: `${resumeTitle.name} | ${resumeTitle.birth} | ${
        resumeTitle.gender
      } | ${resumeTitle.mobile} | ${resumeTitle.email}`
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
    const { clickedData } = await this.state

    const resumeTitle = await {
      mobile:
        clickedData.mobile && clickedData.mobile !== 'null'
          ? clickedData.mobile
          : '등록된 번호 없음',
      email:
        clickedData.email && clickedData.email !== 'null'
          ? clickedData.email
          : '등록된 이메일 없음',
      gender:
        clickedData.gender && clickedData.gender !== 'nu'
          ? clickedData.gender
          : '등록된 성별 없음',
      birth:
        clickedData.birth && clickedData.birth !== 'null'
          ? clickedData.birth
          : '등록된 나이 없음',
      name:
        clickedData.name && clickedData.name !== 'null'
          ? clickedData.name
          : '등록된 이름 없음'
    }
    await this.setState({
      resumeDetailTitle: `${resumeTitle.name} | ${resumeTitle.birth} | ${
        resumeTitle.gender
      } | ${resumeTitle.mobile} | ${resumeTitle.email}`
    })
    await this.getResumeDetail(this.state.clickedData.rm_code)
  }

  arrowKeyPush = async event => {
    if (this.state.visible && event.keyCode === 37) {
      this.onLeftClick()
    } else if (this.state.visible && event.keyCode === 39) {
      this.onRightClick()
    }
  }
  peopleModal = () => {
    let schoolDetail = this.state.resumeDetailData[0].school
      .split(`\\n`)
      .map(line => {
        return (
          <span>
            {line}
            <br />
          </span>
        )
      })

    let companyDetail = this.state.resumeDetailData[0].company
      // .split('null')
      .split(`\\n`)
      .map(line => {
        return (
          <span>
            {line}
            <br />
          </span>
        )
      })

    let othersDetail = this.state.resumeDetailData[0].others
      .split(`\\n`)
      .map(line => {
        return (
          <span>
            {line}
            <br />
          </span>
        )
      })

    return (
      <div>
        <Modal
          title={this.state.resumeDetailTitle}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          width="80%"
        >
          <Row style={{ textAlign: 'left' }}>
            <Col span={2} />
            <Col span={20}>
              <h3>[ School ]</h3>
            </Col>
            <Col span={2} />
          </Row>
          <Row style={{ textAlign: 'left' }}>
            <Col span={2} />
            <Col span={20}>
              {/* <p>{this.state.resumeDetailData[0].school}</p> */}
              <p>{schoolDetail}</p>
            </Col>
            <Col span={2} />
          </Row>
          <Divider />
          <Row style={{ textAlign: 'left' }}>
            <Col span={2} />
            <Col span={20}>
              <h3>[ Company ]</h3>
            </Col>
            <Col span={2} />
          </Row>
          <Row>
            <Col span={2} style={{ textAlign: 'left' }}>
              <Button
                type="primary"
                icon="left"
                value="large"
                onClick={this.onLeftClick}
              />
            </Col>
            <Col span={20}>
              <p>{companyDetail}</p>
              {/* <p>{this.state.resumeDetailData[0].company}</p> */}
            </Col>
            <Col span={2} style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                icon="right"
                value="large"
                onClick={this.onRightClick}
              />
            </Col>
          </Row>
          <Divider />
          <Row style={{ textAlign: 'left' }}>
            <Col span={2} />
            <Col span={20}>
              <h3>[ Others ]</h3>
            </Col>
            <Col span={2} />
          </Row>
          <Row style={{ textAlign: 'left' }}>
            <Col span={2} />
            <Col span={20}>
              {this.state.resumeDetailData[0].others.length > 200 ? (
                <details>
                  <summary>
                    {this.state.resumeDetailData[0].others.slice(0, 40)}
                  </summary>
                  <p>{othersDetail}</p>
                  {/* <p>{this.state.resumeDetailData[0].others}</p> */}
                </details>
              ) : (
                othersDetail
                // this.state.resumeDetailData[0].others
              )}
            </Col>
            <Col span={2} />
          </Row>
          <this.memoTable />
        </Modal>
      </div>
    )
  }

  memoTable = () => {
    const columns = [
      {
        title: 'Position',
        dataIndex: 'memo_position',
        align: 'center',
        width: '20%'
      },
      {
        title: 'Client',
        dataIndex: 'memo_client',
        align: 'center',
        width: 100
      },
      {
        title: '담당 헤드헌터',
        dataIndex: 'memo_username',
        align: 'center',
        width: 75
      },
      {
        title: '일시',
        dataIndex: 'memo_date',
        align: 'center',
        width: 90
      },
      {
        title: '메모',
        dataIndex: 'memo_text',
        align: 'center',
        width: '30%'
      }
    ]

    if (!this.state.resumeDetailData[0].memo) {
      return (
        <div>
          <Divider />
          <Row style={{ textAlign: 'left' }}>
            <Col span={2} />
            <Col span={20}>
              <h3>[ Position & Memo ]</h3>
            </Col>
            <Col span={2} />
          </Row>
          <Row style={{ textAlign: 'left' }}>
            <Col span={2} />
            <Col span={20}>
              <div>메모 내용이 없습니다.</div>
            </Col>
            <Col span={2} />
          </Row>
        </div>
      )
    }

    return (
      <div>
        <Divider />
        <Row style={{ textAlign: 'left' }}>
          <Col span={2} />
          <Col span={20}>
            <h3>[ Position & Memo ]</h3>
          </Col>
          <Col span={2} />
        </Row>

        <Table
          bordered
          columns={columns}
          dataSource={this.state.resumeDetailData[0].memo}
          size="middle"
        />
      </div>
    )
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
          `${this.state.selectedRows[0].name} 님의 Resume를 삭제했습니다.`
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
          `${deletedRecipients.join(' 님, ')} 님의 Resume를 삭제했습니다.`
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
          resetSelections={this.resetSelections}
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

    const optionList = this.state.positionData
      .filter(position => position.valid === 'alive')
      .sort((a, b) => {
        return (
          new Date(b.modified_date).getTime() -
          new Date(a.modified_date).getTime()
        )
      })
      .map(position => (
        <Option value={position.title} key={position.position_id}>
          {`${position.title}: ${position.keyword}`}
        </Option>
      ))

    return (
      <div onKeyDown={this.arrowKeyPush}>
        <br />
        <InputGroup compact>
          <Input
            style={{
              marginLeft: '20px',
              width: '6%'
            }}
            placeholder="최소생년"
            name="under_birth"
            maxLength={4}
            value={this.state.under_birth}
            onChange={this.handleAgeChange}
          />
          <Input
            style={{
              width: '6%'
            }}
            placeholder="최대생년"
            name="upper_birth"
            maxLength={4}
            value={this.state.upper_birth}
            onChange={this.handleAgeChange}
          />
          <Checkbox
            style={{ marginLeft: '30px' }}
            value={this.state.isTopSchool}
            onChange={this.checkTopschool}
          >
            Top School
          </Checkbox>
        </InputGroup>
        <br />
        <Input
          style={{ marginLeft: '20px', width: '20%' }}
          placeholder="검색어 (한 칸 띄고 입력해주세요!)"
          onChange={this.handleAndOR}
          value={this.state.andOr}
        />
        <br />
        <Select
          value={this.state.positionTitle}
          showSearch
          style={{ marginTop: '1px', marginLeft: '20px', width: '30%' }}
          optionFilterProp="children"
          onChange={this.handlePositionTitleChange}
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
        <div style={{ marginLeft: '20px', width: '95%' }}>
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
          >
            SMS
          </Button>
          <Button
            type="primary"
            icon="edit"
            onClick={this.showUpdateResumeModal}
            style={{ float: 'right', marginRight: 5, marginBottom: 16 }}
            disabled={selectedRowKeys.length !== 1}
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
            dataSource={dataSource}
            components={components}
            rowKey="rm_code"
            loading={this.state.loading}
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
          {this.state.mailVisible && <this.mailModal />}
          {this.state.smsVisible && <this.smsModal />}
          {this.state.visibleNewResume && <this.addResumeModal />}
          {this.state.visibleUpdateResume && <this.updateResumeModal />}
        </div>
      </div>
    )
  }
}
