import React from 'react'
import { Button, Form, Input } from 'antd'

class SmsForm extends React.Component {
  state = {}

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.sms(values)
        console.log('Received values of form: ', values)
      }
    })
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

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item {...formItemLayout}>
          {getFieldDecorator('title', {
            initialValue: `${this.props.selectedRows[0].client} ${
              this.props.selectedRows[0].position
            } 채용 제안`,
            // initialValue: defaultTitle,
            rules: [{ required: true, message: 'Please fill in the title.' }]
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Content">
          {getFieldDecorator('content', {
            initialValue: `안녕하세요, 어제 제안드렸던 ${
              this.props.selectedRows[0].position
            } 에 대해서 어떻게 생각해보셨는지 문의차 다시 메일 드립니다. 간략히 검토후 의향에 대해서 회신 주시면 감사하겠습니다.`,
            // initialValue: defaultMailContent,
            rules: [{ required: true, message: 'Please fill in the content.' }]
          })(<Input.TextArea rows={4} />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Sign">
          {getFieldDecorator('sign', {
            rules: [{ required: true, message: 'Please fill in the sign.' }]
          })(<Input />)}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
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
