import React from 'react'
import Axios from 'axios'
import { Button, Form, Input, Select, Row, Col, Tooltip } from 'antd'
import API from '../../util/api'
import ShortId from 'shortid'

class SmsForm extends React.Component {
  state = {
    position: '',
    positionData: [],
    smsLength: 0,
    positionCompany: '',
    smsContentIndex: 0,
    recentSendSMSData: ''
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.positionCompany = this.state.positionCompany
        this.props.writeSmsContent(values)
        console.log('Received values of form: ', values)
      }
    })
  }

  handlePositionChange = value => {
    const positionDataIndex = this.state.positionData.findIndex(
      data => data.title === value
    )
    if (positionDataIndex !== -1)
      this.setState({
        position: value,
        positionCompany: this.state.positionData[positionDataIndex].company
      })
  }

  fetchPosition = () => {
    Axios.post(API.getPosition, {
      user_id: this.props.user_id
    }).then(data => {
      const keyAddedResult = data.data.result.map(data => {
        data.key = ShortId.generate()
        return data
      })
      this.setState({
        positionData: keyAddedResult
      })
      // console.log('position data', data.data.result)
      console.log('position data + key', keyAddedResult)
    })
  }

  fetchRecentSendSMSData = () => {
    Axios.post(API.recentSendSMS, {
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
    this.setState({ smsContentIndex, position: '' })
    console.log('smsContentIndex-l', smsContentIndex)
  }

  onRightClick = () => {
    let { smsContentIndex, recentSendSMSData } = this.state
    smsContentIndex += 1
    if (smsContentIndex > recentSendSMSData.length - 1) {
      smsContentIndex = 0
    }
    console.log('smsContentIndex-r', smsContentIndex)
    this.setState({ smsContentIndex, position: '' })
  }

  checkSmsLength = event => {
    this.setState({
      smsLength: event.target.value.length
    })
  }

  componentDidMount() {
    this.fetchPosition()
    this.fetchRecentSendSMSData()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { selectedRows } = this.props
    const {
      smsContentIndex,
      recentSendSMSData,
      position,
      positionData
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

    let receivers =
      selectedRows.length > 1
        ? selectedRows.map((row, index) => row.name).join(',')
        : // ? selectedRows.map((row, index) => row.name).join(',')
          null

    const optionList = positionData
      .filter(position => position.valid === 'alive')
      .sort((a, b) => {
        return (
          new Date(b.modified_date).getTime() -
          new Date(a.modified_date).getTime()
        )
      })
      .map(position => (
        <Option value={position.title} key={position.key}>
          {`${position.title}: ${position.keyword}`}
        </Option>
      ))

    let smsName
    // let signupRule
    let positionRule
    let smsContent = ''
    let recipientPlaceholder

    if (selectedRows.length === 0) {
      smsName = ''
      // signupRule = [{ required: false }]
      positionRule = [{ required: false }]
      recipientPlaceholder = '한 명만 보낼 수 있습니다. 폰 번호를 입력해주세요.'
    } else {
      smsName = receivers || selectedRows[0].name
      // signupRule = [{ required: true, message: 'Please fill in the sign.' }]
      positionRule = [
        { required: true, message: 'Please fill in the content.' }
      ]
      smsContent = `안녕하세요, 어제 제안드렸던 ${position} 에 대해서 어떻게 생각해보셨는지 문의차 다시 문자 드립니다. 간략히 검토후 의향에 대해서 회신 주시면 감사하겠습니다.`
      recipientPlaceholder = ''
    }

    smsContent = recentSendSMSData && recentSendSMSData[smsContentIndex].body
    console.log('smsContent', smsContent)
    console.log('smsContentIndex', smsContentIndex)

    let beforeSmsContentIndex = smsContentIndex - 1
    let afterSmsContentIndex = smsContentIndex + 1
    if (beforeSmsContentIndex < 0) {
      beforeSmsContentIndex = recentSendSMSData.length - 1
    }

    if (afterSmsContentIndex > 9) {
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
      smsContent = `안녕하세요, 어제 제안드렸던 ${position} 에 대해서 어떻게 생각해보셨는지 문의차 다시 문자 드립니다. 간략히 검토후 의향에 대해서 회신 주시면 감사하겠습니다.`
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item
          label="Recipient: " // Recipient
          {...formItemLayout}
        >
          {getFieldDecorator('receiver', {
            initialValue: smsName
            // initialValue: receivers || selectedRows[0].name
          })(<Input placeholder={recipientPlaceholder} />)}
        </Form.Item>

        {/* <Form.Item label="Position: " {...formItemLayout}>
          {getFieldDecorator('position', {
            initialValue: `포지션`
          })(<Input />)}
        </Form.Item> */}

        {selectedRows.length !== 0 ? (
          <Form.Item label="Positions: " {...formItemLayout} hasFeedback>
            {getFieldDecorator('select', {
              // rules: positionRule
            })(
              <Select
                // value={position}
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
        ) : null}
        <Form.Item {...formItemLayout} label="Content">
          {getFieldDecorator('content', {
            initialValue: smsContent,
            rules: [{ required: true, message: 'Please fill in the content.' }]
          })(<Input.TextArea rows={4} onChange={this.checkSmsLength} />)}
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
        </Form.Item>

        {/* <Form.Item {...formItemLayout} label="Sign">
          {getFieldDecorator('sign', {
            rules: signupRule
            // rules: [{ required: true, message: 'Please fill in the sign.' }]
          })(<Input />)}
        </Form.Item> */}

        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
            // disabled={selectedRows.length >= 1 && !!!position}
          >
            SEND
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const WrappedRegistrationForm = Form.create({ name: 'sms' })(SmsForm)

export default {
  SmsRegistration: WrappedRegistrationForm
}
