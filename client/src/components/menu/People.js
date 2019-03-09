import React, { Component } from 'react'
import Axios from 'axios'
import API from '../../util/api'
import ResumeForm from '../forms/ResumeForm'
import UpdateResumeForm from '../forms/UpdateResumeForm'
import MailForm from '../forms/MailForm'
import SmsForm from '../forms/SmsForm'
import MemoForm from '../forms/MemoForm'
import UpdateMemoForm from '../forms/UpdateMemoForm'
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
  Table,
  Popconfirm
} from 'antd'
import Highlighter from 'react-highlight-words'
import { sendSMS, koreanAgetoYear } from '../../util/UtilFunction'

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
      loading: true,
      isReset: false,
      memoAddVisible: false,
      memoUpdateVisible: false,
      editRecord: {},
      sortedInfo: null
    }
  }

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter)
    this.setState({
      // filteredInfo: filters,
      sortedInfo: sorter
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager
    })
    this.fetch({
      sortedInfo: sorter,
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    })
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
          user_id={this.props.user_id}
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

  writeSmsContent = async form => {
    await this.setState({ sms: form, loading: true })
    await console.log('people-sms-form', form)
    // await this.sendSMS()
    await sendSMS(
      this.state.sms,
      this.state.selectedRowKeys,
      this.state.selectedRows,
      this.props.user_id
    )

    await this.handleSmsCancel()
    await this.setState({ loading: false })
  }

  handleUpdateMemoOk = () => {
    this.setState({ memoUpdateVisible: false })
  }

  handleUpdateMemoCancel = () => {
    this.setState({ memoUpdateVisible: false })
  }

  showUpdateMemoModal = async record => {
    // await this.setState(prevState => ({ memoUpdateVisible: true }))

    await this.setState({ memoUpdateVisible: true, editRecord: record })
    await this.updateMemoModal()
  }

  updateMemoModal = () => {
    console.log('addMemoModal', this.state.clickedData)
    // showMemoModal = () => {
    // this.setState({ memoUpdateVisible: true })
    // }

    return (
      <div>
        <Modal
          // title={title}
          title="update memo"
          visible={this.state.memoUpdateVisible}
          onOk={this.handleUpdateMemoOk}
          onCancel={this.handleUpdateMemoCancel}
          footer={null}
        >
          <UpdateMemoForm.UpdateMemoRegistration
            selectedRows={this.state.selectedRows}
            // writeSmsContent={this.writeSmsContent}
            user_id={this.props.user_id}
            rm_code={this.state.clickedData.rm_code}
            handleUpdateMemoCancel={this.handleUpdateMemoCancel}
            getResumeDetail={this.getResumeDetail}
            memoRecord={this.state.editRecord}
          />
        </Modal>
      </div>
    )
  }

  addMemoModal = () => {
    // console.log('addMemoModal', this.state.clickedData)
    console.log('addMemoModal', this.props.optionList)
    console.log('addMemoModal', this.props)
    return (
      <div>
        <Modal
          // title={title}
          title="add memo"
          visible={this.state.memoAddVisible}
          onOk={this.handleMemoAddOk}
          onCancel={this.handleMemoAddCancel}
          footer={null}
        >
          <MemoForm.MemoRegistration
            selectedRows={this.state.selectedRows}
            // writeSmsContent={this.writeSmsContent}
            user_id={this.props.user_id}
            rm_code={this.state.clickedData.rm_code}
            handleMemoAddCancel={this.handleMemoAddCancel}
            getResumeDetail={this.getResumeDetail}
            positionData={this.state.positionData}
            optionList={this.state.optionList}
          />
        </Modal>
      </div>
    )
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
            user_id={this.props.user_id}
          />
        </Modal>
      </div>
    )
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

  getResumeDetail = async (rm_code, memoData) => {
    // await console.log('rmcode', rm_code)
    // await console.log('this.props.user_id--ppp', this.props)
    // await console.log('this.props.user_id', this.props.user_id)
    // await console.log('this.props.user_id2', this.state.clickedData.rm_code)
    if (rm_code && !memoData) {
      await Axios.post(API.rmDetail, {
        user_id: this.props.user_id,
        rm_code: this.state.clickedData.rm_code
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
    } else if (memoData) {
      await Axios.post(API.rmDetail, {
        user_id: memoData.user_id,
        rm_code: memoData.rm_code
      })
        .then(res => {
          console.log('this-memoData?', res.data.result)
          this.setState({
            resumeDetailData: res.data.result
          })
        })
        .catch(err => {
          console.log(err.response)
        })
    }
  }

  fetch = () => {
    this.setState({
      loading: true
    })
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

      const dateSortedData = data.data.result.sort((a, b) => {
        // descend
        return (
          new Date(b.modified_date).getTime() -
          new Date(a.modified_date).getTime()
        )
      })

      const result = dateSortedData.map((row, i) => {
        const each = Object.assign({}, row)
        each.key = i
        if (each.url.includes('jobkorea')) each.website = 'jobkorea'
        else if (each.url.includes('saramin')) each.website = 'saramin'
        else if (each.url.includes('linkedin')) each.website = 'linkedin'
        else if (each.url.includes('incruit')) each.website = 'incruit'
        return each
      })
      // console.log('fetch-result', result)
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
      this.getPositionOptionList(data.data.result)
      this.setState({
        positionData: data.data.result
      })
    })
  }

  getPositionOptionList = positionData => {
    const Option = Select.Option
    const optionList = positionData
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
    this.setState({ optionList })
  }

  fetchAgain = () => {
    //send input data
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

    // 더 이상 클라이언트 측에서는 키워드 값을 변경하지 않고 그대로 보냄

    // if (positionKeyword && positionKeyword.includes(' ')) {
    //   let commaDeletedpositon = positionKeyword.replace(/,/gi, '')
    //   positionSplit = commaDeletedpositon.split(' ').join('||')
    // } else {
    //   positionSplit = positionKeyword
    // }

    positionSplit = positionKeyword

    if (positionSplit && andOr) {
      unitedSearch = `${positionSplit},${andOr}`
      // unitedSearch = `${positionSplit}||${andOr}`
    } else if (positionSplit) {
      unitedSearch = positionSplit
    } else if (andOr) {
      unitedSearch = andOr
    }

    // console.log('positionKeyword', positionKeyword)
    // console.log('unitedSearch', unitedSearch)

    // 입력된 나이로 db 데이터에 맞게 나이로 계산 주의, 나이를 변환하기 때문에 순서가 변경되야 함
    const upperBirth = under_birth && koreanAgetoYear(under_birth)
    const underBirth = upper_birth && koreanAgetoYear(upper_birth)

    // console.log('under_birth', underBirth)
    // console.log('upper_birth', upperBirth)

    this.setState({ loading: true })
    Axios.post(API.viewMainTablePosition, {
      user_id: this.props.user_id,
      under_birth: underBirth || 1900,
      upper_birth: upperBirth || 2400,
      top_school: isTopSchool,
      keyword: unitedSearch
      // position: position
      // keyword: andOr
    }).then(data => {
      const pagination = { ...this.state.pagination }
      pagination.total = 200

      // const dateSortedData = data.data.result.sort((a, b) => {
      //   // descend
      //   return (
      //     new Date(b.modified_date).getTime() -
      //     new Date(a.modified_date).getTime()
      //   )
      // })

      // fetchagain 시엔 rate로 정렬하기 때문에 날짜 정렬 없앰
      const dateSortedData = data.data.result

      const result = dateSortedData.map((row, i) => {
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
    this.setState({
      selectedKeys: [],
      searchText: '',
      isReset: true,
      sortedInfo: {
        order: 'descend',
        columnKey: 'rate'
      }
    })
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

  showMemoModal = () => {
    this.setState({ memoAddVisible: true })
  }

  handleMemoAddOk = () => {
    this.setState({ memoAddVisible: false })
  }

  handleMemoAddCancel = () => {
    this.setState({ memoAddVisible: false })
  }

  handleOk = () => {
    this.setState({ visible: false })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  resetAll = async () => {
    if (this.state.searchText)
      await this.setState({ searchText: '', isReset: true })

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
      selected: '',
      andOr: '',
      searchCount: 0,
      sortedInfo: null
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

    // const koreanAge =
    //   (await clickedData.birth) && koreanAgetoYear(clickedData.birth)

    const resumeTitle = await this.resumeTitle(clickedData)

    await this.setState({
      resumeDetailTitle: this.resumeDetailTitle(resumeTitle)
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
    const resumeTitle = await this.resumeTitle(clickedData)

    await this.setState({
      resumeDetailTitle: this.resumeDetailTitle(resumeTitle)
    })
    await this.getResumeDetail(this.state.clickedData.rm_code)
  }

  handleClick = async clickedData => {
    await this.setState({ clickedData })
    const resumeTitle = await this.resumeTitle(clickedData)

    await this.setState({
      resumeDetailTitle: this.resumeDetailTitle(resumeTitle)
    })

    await this.getResumeDetail(clickedData.rm_code)
    await this.showModal()
  }

  resumeDetailTitle = resumeTitle => (
    <span>
      {resumeTitle.name} | {resumeTitle.birth} | {resumeTitle.gender} |{' '}
      {resumeTitle.mobile} | {resumeTitle.email} | {resumeTitle.url}
    </span>
  )

  resumeTitle = clickedData => ({
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
        : '등록된 이름 없음',
    url:
      clickedData.url && clickedData.url !== 'null' ? (
        <a
          href={clickedData.url}
          rel="noopener noreferrer"
          target="_blank"
          onClick={this.handleCancel}
        >
          URL
        </a>
      ) : (
        '등록된 URL 없음'
      )
  })

  arrowKeyPush = async event => {
    if (this.state.visible && event.keyCode === 37) {
      this.onLeftClick()
    } else if (this.state.visible && event.keyCode === 39) {
      this.onRightClick()
    }
  }

  splitLine(data) {
    return data
      .split(`\\n`)
      .filter(str => !!str && /\S/.test(str))
      .map(line => {
        return (
          <span>
            {line}
            <br />
          </span>
        )
      })
  }

  peopleModal = () => {
    let schoolDetail =
      this.state.resumeDetailData[0] &&
      this.splitLine(this.state.resumeDetailData[0].school)

    let companyDetail =
      this.state.resumeDetailData[0] &&
      this.splitLine(this.state.resumeDetailData[0].company)

    let othersDetail =
      this.state.resumeDetailData[0] &&
      this.splitLine(this.state.resumeDetailData[0].others)

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
              {this.state.resumeDetailData[0] &&
              this.state.resumeDetailData[0].others.length > 200 ? (
                <details>
                  <summary>
                    {this.state.resumeDetailData[0].others.slice(0, 40)}
                  </summary>
                  <p>{othersDetail}</p>
                  {/* <p>{this.state.resumeDetailData[0].others}</p> */}
                </details>
              ) : (
                othersDetail
              )}
            </Col>
            <Col span={2} />
          </Row>
          {this.state.resumeDetailData && <this.memoTable />}
          {/* <this.memoTable /> */}
        </Modal>
      </div>
    )
  }

  handleMemoDelete = async record => {
    console.log('record_key', record)
    // console.log('record_key', record_key)
    try {
      await Axios.post(API.deleteMemo, {
        user_id: this.props.user_id,
        memo_id: record.memo_id
      })

      await console.log('memo deleted')
      await this.getResumeDetail(this.state.clickedData.rm_code)

      // await this.props.handleMemoAddCancel()
      // const memoData = await {
      //   user_id: this.props.user_id,
      //   rm_code: this.props.rm_code
      // }
      // await this.props.getResumeDetail(this.props.rm_code, memoData)
      // // await this.getResumeDetail(memoData)
    } catch (err) {
      console.log(err)
    }
  }

  memoTable = () => {
    const columns = [
      {
        title: 'Position',
        dataIndex: 'position',
        align: 'center',
        // width: '20%',
        width: 80
      },
      {
        title: 'Client',
        dataIndex: 'client_name',
        align: 'center',
        width: 80
      },
      {
        title: '담당 헤드헌터ID',
        dataIndex: 'user_id',
        align: 'center',
        width: 50
      },
      {
        title: '마지막 수정 일시',
        dataIndex: 'modified_date',
        align: 'center',
        width: 90
      },
      {
        title: '메모',
        dataIndex: 'note',
        align: 'center',
        width: '30%'
      },
      {
        title: 'Action',
        dataIndex: 'Action',
        align: 'center',
        width: 60,
        render: (text, record) =>
          this.state.resumeDetailData.length >= 1 ? (
            <div>
              <Button
                size="small"
                style={{ marginRight: 5 }}
                onClick={() => this.showUpdateMemoModal(record)}
              >
                Edit
              </Button>
              {/* <Button
                size="small"
                onClick={() => this.handleMemoDelete(record)}
              >
                Delete
              </Button> */}
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleMemoDelete(record)}
              >
                <Button size="small"> Delete</Button>
              </Popconfirm>
            </div>
          ) : // <Popconfirm
          //   title="Sure to delete?"
          //   onConfirm={() => this.handleMemoDelete(record)}
          // >
          //   <a href="javascript:;">Delete</a>
          // </Popconfirm>
          null
      }
    ]

    let dateSortedMemo = []
    if (
      this.state.resumeDetailData[0].memo !== null &&
      this.state.resumeDetailData[0].memo &&
      this.state.resumeDetailData[0].memo !== 'null'
    ) {
      dateSortedMemo = this.state.resumeDetailData[0].memo.sort((a, b) => {
        // descend
        return (
          new Date(b.modified_date).getTime() -
          new Date(a.modified_date).getTime()
        )
      })

      for (let i = 0; i < dateSortedMemo.length; i++) {
        dateSortedMemo[i].key = i
      }
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

        <Row>
          {/* <Button
            type="primary"
            icon="edit"
            size="small"
            onClick={this.updateMemoModal}
            style={{
              float: 'right',
              marginRight: 5,
              marginTop: 10,
              marginBottom: 5
            }}
            // disabled={!hasSelectedOne}
          >
            메모 편집
          </Button> */}
          {/* <Button
            type="primary"
            icon="delete"
            size="small"
            style={{
              float: 'right',
              marginRight: 5,
              marginTop: 10,
              marginBottom: 5
            }}

            // disabled={!hasSelectedMultiple}
          >
            메모 삭제
          </Button> */}
          <Button
            style={{
              float: 'right',
              marginRight: 5,
              marginTop: 10,
              marginBottom: 5
            }}
            type="primary"
            icon="user-add"
            size="small"
            onClick={this.showMemoModal}
          >
            메모 등록
          </Button>

          <span
            style={{
              float: 'left',
              // marginLeft: 8,
              // marginLeft: 65,
              marginTop: 10,
              marginBottom: 5
            }}
          >
            {dateSortedMemo.length > 0
              ? `Total ${dateSortedMemo.length} Memos`
              : // ? `Total ${this.state.resumeDetailData[0].memo.length} Memos`
                ''}
          </span>
        </Row>

        <Row style={{ textAlign: 'left' }}>
          {/* <Col span={2} /> */}
          <Col span={24}>
            <Table
              bordered
              columns={columns}
              dataSource={dateSortedMemo}
              size="middle"
            />
          </Col>
          {/* <Col span={2} /> */}
        </Row>
      </div>
    )
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => {
      if (
        !this.state.searchText &&
        this.state.isReset &&
        selectedKeys.length > 0
      ) {
        this.handleReset(clearFilters)
        this.setState({ isReset: false })
      }
      return (
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
      )
    },
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),

    onFilter: (value, record) => {
      return (
        record[dataIndex] &&
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
      )
    },
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
    // orginial
    // let words
    // const searchWords = e.target.value
    // if (searchWords && searchWords.includes(' ')) {
    //   words = searchWords.split(' ').join('||')
    // } else {
    //   words = searchWords
    // }

    // this.setState({ andOr: words })

    this.setState({ andOr: e.target.value })
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
    const { optionList, dataSource, selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    }
    const hasSelected = selectedRowKeys.length > 0

    let { sortedInfo } = this.state
    sortedInfo = sortedInfo || {}

    const columns = [
      {
        key: 'name',
        title: '이름',
        dataIndex: 'name',
        align: 'center',
        ...this.getColumnSearchProps('name')
      },
      {
        key: 'birth',
        title: '한국나이',
        dataIndex: 'birth',
        width: 75,
        align: 'center',
        sorter: (a, b) => b.birth - a.birth,
        sortOrder: sortedInfo.columnKey === 'birth' && sortedInfo.order,
        // sortDirections: ['descend', 'ascend'],
        // ...this.getColumnSearchProps('birth'),
        render: (text, row, index) => {
          // 검색기능과 render를 같이 못 씀 -> 같이 쓸 수 있 지 만 나이 추가 데이터는 검색 안됨
          let age
          if (text !== 'null' && text) {
            let date = new Date()
            let year = date.getFullYear()
            age = year - Number(text) + 1
          }
          return (
            <span>
              {/* 한국나이 {age} 출생년도 {text} */}
              {/* {text} 한국나이 {age} */}
              {age}
            </span>
          )
        }
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
        width: 120,
        ...this.getColumnSearchProps('keyword')
      },
      {
        key: 'resume_title',
        title: 'Resume Title',
        dataIndex: 'resume_title',
        align: 'center',
        width: 120,
        ...this.getColumnSearchProps('resume_title')
      },
      {
        key: 'salary',
        title: '연봉',
        dataIndex: 'salary',
        align: 'center',
        width: 100,
        ...this.getColumnSearchProps('salary')
      },
      {
        key: 'rate',
        title: 'Rate',
        dataIndex: 'rate',
        sorter: (a, b) => a.rate - b.rate,
        // defaultSortOrder: 'descend',
        sortOrder: sortedInfo.columnKey === 'rate' && sortedInfo.order,
        width: 30,
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
            <a
              href={text}
              rel="noopener noreferrer"
              target="_blank"
              onClick={this.handleCancel}
            >
              URL
            </a>
          )
        }
      },
      {
        key: 'website',
        title: 'WEBSITE',
        dataIndex: 'website',
        width: 60,
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
        width: '120',
        ...this.getColumnSearchProps('modified_date')
      }
    ]

    return (
      <div onKeyDown={this.arrowKeyPush}>
        <br />
        <InputGroup compact>
          <Input
            style={{
              marginLeft: '20px',
              width: '8%'
            }}
            placeholder="최소나이"
            name="under_birth"
            maxLength={2}
            value={this.state.under_birth}
            onChange={this.handleAgeChange}
          />
          <Input
            style={{
              width: '8%'
            }}
            placeholder="최대나이"
            name="upper_birth"
            maxLength={2}
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
          onClick={this.resetAll}
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
            rowKey="rm_code"
            loading={this.state.loading}
            // onChange={this.handleTableChange}
            rowSelection={rowSelection}
            onRow={record => ({
              onClick: () => {
                console.log('record', record)
                this.handleClick(record)
              }
            })}
            onChange={this.handleChange}
          />

          {this.state.memoUpdateVisible && <this.updateMemoModal />}
          {this.state.memoAddVisible && <this.addMemoModal />}
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
