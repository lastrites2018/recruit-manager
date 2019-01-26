import React from 'react'
import { Button, Form, Input, Select } from 'antd'

class MailForm extends React.Component {
  state = {
    positon: ''
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.mail(values)
        console.log('Received values of form: ', values)
      }
    })
  }

  handlePositionChange = value => {
    this.setState({ position: value })
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

    const optionList = this.props.positionData.map((position, index) => (
      <Select.Option value={position.keyword} key={index}>
        {`${position.title}    키워드 : ${position.keyword}`}
      </Select.Option>
    ))

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item 
          label='Title: '
          {...formItemLayout}>
          {getFieldDecorator('title', {
            initialValue: `채용 제안`,
            rules: [{ required: true, message: 'Please fill in the title.' }]
          })(<Input />)}
        </Form.Item>

        <Form.Item 
          label='Recipient: ' 
          {...formItemLayout}>
          {getFieldDecorator('receiver', {
            initialValue: `${this.props.selectedRows[0].name}`
          })(<Input />)}
        </Form.Item>

        <Form.Item // 여기 수정 필요해요~ //
          label='Positions: '
          {...formItemLayout}
          hasFeedback
        >
          {getFieldDecorator('position', {
            rules: [{ required: true, message: 'Please select the position.' }]
          })(
            <optionList />
          )}
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

const WrappedRegistrationForm = Form.create({ name: 'mail' })(MailForm)

export default {
  MailRegistration: WrappedRegistrationForm
}
