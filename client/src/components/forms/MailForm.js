import React from 'react'
import Axios from 'axios'
import { Button, Form, Input, Select } from 'antd'
import API from '../../util/api'
class MailForm extends React.Component {
  state = {
    positon: '',
    positionCompany: '',
    positionDetail: '',
    positionData: []
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.mail(values)
        console.log('Received values of form: ', values)
      }
    })
    this.setState({ position: '', positionCompany: '', positionDetail: '' })
  }

  handlePositionChange = async value => {
    await this.setState({ position: value })
    for (let i = 0; i < this.state.positionData.length; i++) {
      if (this.state.positionData[i].title === this.state.position) {
        await this.setState({
          positionDetail: this.state.positionData[i].detail,
          positionCompany: this.state.positionData[i].company
        })
      }
    }
  }

  fetchPosition = () => {
    Axios.post(API.getPosition, {
      user_id: this.props.user_id
    }).then(data => {
      this.setState({
        positionData: data.data.result
      })
      console.log('position data', data.data.result)
    })
  }

  componentDidMount() {
    console.log('mailform 요청확인')
    this.fetchPosition()
  }

  render() {
    const { getFieldDecorator } = this.props.form

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

    const optionList = this.state.positionData.map((position, index) => (
      <Select.Option value={position.title} key={index}>
        {`${position.title}: ${position.keyword}`}
      </Select.Option>
    ))

    console.log('position', this.state.position)
    console.log('company', this.state.positionCompany)
    console.log('position detail', this.state.positionDetail)

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item label="Title" {...formItemLayout}>
          {getFieldDecorator('title', {
            initialValue: `${this.state.positionCompany} ${
              this.state.position
            } 채용 제안`,
            rules: [{ required: true }]
          })(<Input />)}
        </Form.Item>

        <Form.Item label="Recipient" {...formItemLayout}>
          {getFieldDecorator('receiver', {
            initialValue: this.props.allRecipients.join(', '),
            rules: [{ required: true }]
          })(<Input />)}
        </Form.Item>

        <Form.Item label="Emails" {...formItemLayout}>
          {/* Input에 readOnly 하고 싶은데 안됨! */}
          {getFieldDecorator('email', {
            initialValue: this.props.allEmails.join(', '),
            rules: [{ required: true }]
          })(<Input.TextArea rows={2} />)}
        </Form.Item>

        <Form.Item label="Content" {...formItemLayout}>
          {getFieldDecorator('content', {
            initialValue: `안녕하세요, \n\n어제 제안드렸던 [${
              this.state.position
            }] 에 대해서 어떻게 생각해보셨는지 문의차 다시 메일 드립니다. \n\n간략히 검토후 의향에 대해서 회신 주시면 감사하겠습니다.`,
            rules: [{ required: true }]
          })(<Input.TextArea rows={4} />)}
        </Form.Item>

        <Form.Item label="Positions" {...formItemLayout} hasFeedback>
          {getFieldDecorator('position', {
            rules: [{ required: true }]
          })(
            <Select
              value={this.state.position}
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

        <Form.Item label="Position Detail" {...formItemLayout}>
          {getFieldDecorator('position_detail', {
            initialValue: this.state.positionDetail
          })(<Input.TextArea rows={4} />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Sign">
          {getFieldDecorator('sign', {
            initialValue: `커리어셀파 헤드헌터 강상모 \n+82 010 3929 7682 \nwww.careersherpa.co.kr`,
            rules: [{ required: true }]
          })(<Input.TextArea rows={4} />)}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
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
