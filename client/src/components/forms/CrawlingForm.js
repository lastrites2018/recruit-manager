import React from 'react'
import { Button, Form, Input, Select } from 'antd'

class CrawlingForm extends React.Component {
  state = {
    age: null,
    keywords: [],
    area: null,
    website: null
  }

  handleOption = e => {
    console.log(e)
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        this.props.handleSearch(values)
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
        <Form.Item {...formItemLayout} label="Age" style={{ marginBottom: 0 }}>
          <Form.Item
            style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
          >
            {getFieldDecorator('min_age')(<Input placeholder="25" />)}
          </Form.Item>
          <span
            style={{
              display: 'inline-block',
              width: '24px',
              textAlign: 'center'
            }}
          >
            -
          </span>
          <Form.Item
            style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
          >
            {getFieldDecorator('max_age')(<Input placeholder="35" />)}
          </Form.Item>
        </Form.Item>

        <Form.Item {...formItemLayout} label="Keywords">
          {getFieldDecorator('keyword', {
            rules: [{ required: true, message: 'Please fill in the keyword.' }]
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Area">
          {getFieldDecorator('area', {
            rules: [{ required: true, message: 'Please fill in the area.' }]
          })(<Input placeholder="Seoul" />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Website">
          {getFieldDecorator('websites', {
            rules: [
              {
                type: 'string',
                required: true,
                message: 'Please select a website.'
              }
            ]
          })(
            <Select
              size="default"
              placeholder="LinkedIn | Jobkorea | Saramin | Incruit"
              onChange={this.handleOption}
            >
              <Select.Option value="linkedin">LinkedIn</Select.Option>
              <Select.Option value="jobkorea">Jobkorea</Select.Option>
              <Select.Option value="saramin">Saramin</Select.Option>
              <Select.Option value="incruit">Incruit</Select.Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const WrappedRegistrationForm = Form.create({ name: 'crawling' })(CrawlingForm)

export default {
  CrawlingRegistration: WrappedRegistrationForm
}
