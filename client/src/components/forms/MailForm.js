import React from 'react'
import Axios from 'axios'
import { Button, Form, Input, Select, Row, Col, Tooltip } from 'antd'
import API from '../../util/api'
class MailForm extends React.Component {
  state = {
    positon: '',
    positionCompany: '',
    positionDetail: '',
    positionData: [],
    smsContentIndex: 0,
    recentSendSMSData: ''
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let localRmDataObj = JSON.parse(localStorage.getItem('recruitManager'))
        if (!localRmDataObj) {
          localRmDataObj = {}
        }
        localRmDataObj.userSign = values.sign
        localStorage.setItem('recruitManager', JSON.stringify(localRmDataObj))

        values.positionCompany = this.state.positionCompany
        this.props.writeMailContent(values)
        console.log('Received values of form: ', values)
      }
    })
    this.setState({ position: '', positionCompany: '', positionDetail: '' })
  }

  // handlePositionChange = async value => {
  //   await this.setState({ position: value })
  //   for (let i = 0; i < this.state.positionData.length; i++) {
  //     if (this.state.positionData[i].title === this.state.position) {
  //       await this.setState({
  //         positionDetail: this.state.positionData[i].detail,
  //         positionCompany: this.state.positionData[i].company
  //       })
  //     }
  //   }
  // }

  handlePositionChange = value => {
    // 위 함수 리팩토링 for문 끝까지 도는 것에서, 하나라도 발견하면 끝나는 findIndex로
    const positionDataIndex = this.state.positionData.findIndex(
      data => data.title === value
    )
    if (positionDataIndex !== -1)
      this.setState({
        position: value,
        positionDetail: this.state.positionData[positionDataIndex].detail,
        positionCompany: this.state.positionData[positionDataIndex].company
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

  fetchRecentSendSMSData = () => {
    Axios.post(API.recentSendMail, {
      user_id: this.props.user_id
    }).then(data => {
      this.setState({
        recentSendSMSData: data.data.result
      })
      console.log('recent SMS DATA ', data.data.result)
    })
  }

  onLeftClick = () => {
    let { smsContentIndex, recentSendSMSData } = this.state

    smsContentIndex -= 1

    if (smsContentIndex < 0) {
      smsContentIndex = recentSendSMSData.length - 1
    }
    this.setState({ smsContentIndex, position: '', positionDetail: '' })
    console.log('smsContentIndex-l', smsContentIndex)
  }

  onRightClick = () => {
    let { smsContentIndex, recentSendSMSData } = this.state
    smsContentIndex += 1
    if (smsContentIndex > recentSendSMSData.length - 1) {
      smsContentIndex = 0
    }
    console.log('smsContentIndex-r', smsContentIndex)
    this.setState({ smsContentIndex, position: '', positionDetail: '' })
  }

  componentDidMount() {
    this.fetchPosition()
    this.fetchRecentSendSMSData()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const {
      smsContentIndex,
      recentSendSMSData,
      position,
      positionData,
      positionCompany,
      positionDetail
    } = this.state
    const Option = Select.Option

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    }

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

    let userSign

    const localRmDataObj = JSON.parse(localStorage.getItem('recruitManager'))
    if (localRmDataObj && localRmDataObj.userSign) {
      userSign = localRmDataObj.userSign
    } else {
      userSign = `커리어셀파 헤드헌터 강상모 \n+82 010 3929 7682 \nwww.careersherpa.co.kr`
    }

    let smsContent = ''

    smsContent = recentSendSMSData && recentSendSMSData[smsContentIndex].body
    console.log('smsContent', smsContent)
    console.log('smsContentIndex', smsContentIndex)
    console.log('recentSendSMSData', recentSendSMSData)

    let beforeSmsContentIndex = smsContentIndex - 1
    let afterSmsContentIndex = smsContentIndex + 1
    if (beforeSmsContentIndex < 0) {
      beforeSmsContentIndex = recentSendSMSData.length - 1
    }

    if (afterSmsContentIndex > recentSendSMSData.length - 1) {
      afterSmsContentIndex = 0
    }

    let leftTooltip =
      recentSendSMSData &&
      `이전\nNo. ${beforeSmsContentIndex + 1} : ${
        recentSendSMSData[beforeSmsContentIndex].modified_date
      }`

    let rightTooltip =
      recentSendSMSData &&
      `다음\nNo. ${afterSmsContentIndex + 1} : ${
        recentSendSMSData[afterSmsContentIndex].modified_date
      }`
    if (position) {
      smsContent = `안녕하세요, \n\n어제 제안드렸던 [${position}] 에 대해서 어떻게 생각해보셨는지 문의차 다시 메일 드립니다. \n\n간략히 검토후 의향에 대해서 회신 주시면 감사하겠습니다.`
      // smsContent = `안녕하세요, 어제 제안드렸던 ${position} 에 대해서 어떻게 생각해보셨는지 문의차 다시 문자 드립니다. 간략히 검토후 의향에 대해서 회신 주시면 감사하겠습니다.`
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item label="Positions" {...formItemLayout} hasFeedback>
          {getFieldDecorator('position', {
            rules: [{ required: true }]
          })(
            <Select
              value={position}
              showSearch
              style={{ width: '90 %' }}
              optionFilterProp="children"
              onChange={this.handlePositionChange}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {optionList}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Title" {...formItemLayout}>
          {getFieldDecorator('title', {
            initialValue: `${positionCompany} ${position} 채용 제안`,
            rules: [{ required: true }]
          })(<Input />)}
        </Form.Item>

        <Form.Item label="Recipient" {...formItemLayout}>
          {getFieldDecorator('receiver', {
            initialValue: this.props.allRecipients.join(', '),
            rules: [{ required: true }]
          })(<Input autosize />)}
        </Form.Item>

        <Form.Item label="Emails" {...formItemLayout}>
          {/* Input에 readOnly 하고 싶은데 안됨! -> disabled 쓰면 됨*/}
          {getFieldDecorator('email', {
            initialValue: this.props.allEmails.join(', '),
            rules: [{ required: true }]
          })(<Input.TextArea rows={1} autosize disabled />)}
        </Form.Item>

        <Form.Item label="Content" {...formItemLayout}>
          <Row>
            <Col span={2} style={{ textAlign: 'left' }}>
              <Tooltip placement="left" title={leftTooltip}>
                <Button
                  type="primary"
                  icon="left"
                  value="large"
                  onClick={this.onLeftClick}
                  disabled={leftTooltip ? false : true}
                />
              </Tooltip>
            </Col>
            <Col span={20} style={{ textAlign: 'center' }}>
              {' '}
              {position ? null : (
                <span>
                  {recentSendSMSData &&
                    `No. ${smsContentIndex + 1} ${
                      recentSendSMSData[smsContentIndex].modified_date
                    }`}
                </span>
              )}
              {/* <span>
                {this.state.smsLength
                  ? this.state.smsLength
                  : smsContent && smsContent.length}
                /90
              </span> */}
            </Col>
            <Col span={2} style={{ textAlign: 'right' }}>
              <Tooltip placement="right" title={rightTooltip}>
                <Button
                  type="primary"
                  icon="right"
                  value="large"
                  onClick={this.onRightClick}
                  disabled={rightTooltip ? false : true}
                />
              </Tooltip>
            </Col>
          </Row>
          {getFieldDecorator('content', {
            initialValue: smsContent,
            // initialValue: `안녕하세요, \n\n어제 제안드렸던 [${position}] 에 대해서 어떻게 생각해보셨는지 문의차 다시 메일 드립니다. \n\n간략히 검토후 의향에 대해서 회신 주시면 감사하겠습니다.`,
            rules: [{ required: true }]
          })(<Input.TextArea rows={4} autosize={{ maxRows: 15 }} />)}
        </Form.Item>

        <Form.Item label="Position Detail" {...formItemLayout}>
          {getFieldDecorator('position_detail', {
            initialValue: positionDetail
          })(<Input.TextArea rows={4} autosize={{ maxRows: 15 }} />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Sign">
          {getFieldDecorator('sign', {
            initialValue: userSign,
            // initialValue: `커리어셀파 헤드헌터 강상모 \n+82 010 3929 7682 \nwww.careersherpa.co.kr`,
            rules: [{ required: true }]
          })(<Input.TextArea rows={3} autosize={{ maxRows: 15 }} />)}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
            // disabled={!!!position}
            // onKeyPress={() => this.handleSubmit}
          >
            SEND
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const WrappedRegistrationForm = Form.create({ name: 'mail' })(MailForm)

export default {
  MailRegistration: WrappedRegistrationForm
}
