import React from 'react'
import Axios from 'axios'
import { Button, Form, Input } from 'antd'
import API from '../../util/api'

class ResumeForm extends React.Component {
  state = {
    newResume: {}
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) this.setState({ newResume: values }, () => {
        this.uploadResume()
      })
    })
  }

  uploadResume = async () => {
    try {
      await console.log(this.state.newResume)
      await Axios.post(API.insertResume, {
      user_id: this.props.user_id,
      name: this.state.newResume.name,
      birth: '',
      age: '',
      gender: '',
      mobile: '',
      email: '',
      job_keyword: '',
      job_title: '',
      educational_history: '',
      career_history: '',
      salary_requirement: '',
      working_area: ''
    })
      await console.log('resume added')
      await this.props.close()
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item
          label='이름 | 출생년도 | Gender'
          {...formItemLayout}
          style={{ marginBottom: 0 }}
          >
          <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
            {getFieldDecorator('name', {
              placeholder: '이름',
              rules: [
                { type: 'string', message: 'Name must be a string.'},
                { required: true, message: 'Please fill in the name.' }]
            })(
            <Input />
            )}
          </Form.Item>
          <Form.Item
            style={{ display: 'inline-block', width: 'calc(25% - 12px)' }}>
            {getFieldDecorator('birth_year', {
              placeholder: 1993,
              rules: [
                { type: 'number', message: 'Birth year must be a number.'},
                { required: true, message: 'Please fill in the birth year.' }]
            })(
            <Input />
            )}
          </Form.Item>
          <Form.Item
            style={{ display: 'inline-block', width: 'calc(25% - 12px)' }}>
          {getFieldDecorator('gender', {
            placeholder: '남 | 여',
            rules: [{ type: 'string', message: 'Gender must be a number.'}]
          })(
            <Input />
            )}
          </Form.Item>
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label='Mobile'
        >
          {getFieldDecorator('mobile', {
            rules: [{ required: true, message: 'Please fill in the mobile.' }]
          })(
              <Input />
          )}
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label='Email'
        >
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please fill in the email.' }]
          })(
              <Input />
          )}
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label='Keywords'
        >
          {getFieldDecorator('keywords', {
            rules: [{ required: true, message: 'Please fill in the keywords.' }]
          })(
              <Input />
          )}
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label='Job Title'
        >
          {getFieldDecorator('job_title', {
            rules: [{ required: true, message: 'Please fill in the job title.' }]
          })(
              <Input />
          )}
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label='Education History'
        >
          {getFieldDecorator('educational_history', {
            initialValue: '',
          })(
              <Input />
          )}
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label='Career History'
        >
          {getFieldDecorator('career_history', {
            initialValue: '',
          })(
              <Input />
          )}
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label='Salary Requirement'
        >
          {getFieldDecorator('salary_requirement', {
            initialValue: '',
          })(
              <Input />
          )}
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label='Working Area'
        >
          {getFieldDecorator('working_area', {
            initialValue: '',
          })(
              <Input />
          )}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>Register</Button>
        </Form.Item>
      </Form>
    )
  }
}

const WrappedRegistrationForm = Form.create({ name: 'job' })(ResumeForm)

export default {
    ResumeRegistration: WrappedRegistrationForm
}