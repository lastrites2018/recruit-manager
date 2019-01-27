import React from 'react'
import Axios from 'axios'
import { Button, Form, Input } from 'antd'
import API from '../../util/api'

class ResumeForm extends React.Component {
  state = {
    newResume: {}
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err)
        this.setState({ newResume: values }, () => {
          this.uploadResume()
        })
    })
  }

  uploadResume = async () => {
    console.log('uploadResume!!!!! 접근')
    // FIXME: 피플 내림차순으로 바바꾸기
    try {
      await console.log('newResume', this.state.newResume)
      await Axios.post(API.insertResume, {
        user_id: this.props.user_id,
        name: this.state.newResume.name,
        birth: this.state.newResume.birth_year,
        gender: this.state.newResume.gender,
        mobile: this.state.newResume.mobile,
        address: this.state.newResume.address || '',
        email: this.state.newResume.email || '',
        job_keyword: this.state.newResume.keywords || '',
        job_title: this.state.newResume.job_title || '',
        educational_history: this.state.newResume.educational_history || '',
        career_history: this.state.newResume.career_history || '',
        salary_requirement: this.state.newResume.salary_requirement || '',
        working_area: this.state.newResume.working_area || ''
      })
      await console.log('resume added')
      await this.props.peopleFetch()
      await this.props.addSuccess()
    } catch (err) {
      console.log(err)
    }
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
        <Form.Item
          label="* Candidate Info"
          {...formItemLayout}
          style={{ marginBottom: 0 }}
        >
          <Form.Item
            style={{ display: 'inline-block', width: 'calc(40% - 12px)' }}
          >
            {getFieldDecorator('name', {
              rules: [
                { type: 'string', message: 'Name must be a string.' },
                { required: true, message: 'Please fill in the name.' }
              ]
            })(<Input placeholder="이름" />)}
          </Form.Item>
          <Form.Item
            style={{ display: 'inline-block', width: 'calc(25% - 12px)' }}
          >
            {getFieldDecorator('birth_year', {
              rules: [
                { required: true, message: 'Please fill in the birth year.' }
              ]
            })(<Input placeholder="1993" />)}
          </Form.Item>
          <Form.Item
            style={{ display: 'inline-block', width: 'calc(25% - 12px)' }}
          >
            {getFieldDecorator('gender', {
              rules: [{ type: 'string', message: 'Gender must be a number.' }]
            })(<Input placeholder="남/여" />)}
          </Form.Item>
        </Form.Item>

        <Form.Item {...formItemLayout} label="Mobile">
          {getFieldDecorator('mobile', {
            rules: [{ required: true, message: 'Please fill in the mobile.' }]
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Email">
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please fill in the email.' }]
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Keywords">
          {getFieldDecorator('keywords', {
            rules: [{ required: true, message: 'Please fill in the keywords.' }]
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Job Title">
          {getFieldDecorator('job_title', {
            rules: [
              { required: true, message: 'Please fill in the job title.' }
            ]
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Education History">
          {getFieldDecorator('educational_history', {
            initialValue: ''
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Career History">
          {getFieldDecorator('career_history', {
            initialValue: ''
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Salary Requirement">
          {getFieldDecorator('salary_requirement', {
            initialValue: ''
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Working Area">
          {getFieldDecorator('working_area', {
            initialValue: ''
          })(<Input />)}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const WrappedRegistrationForm = Form.create({ name: 'job' })(ResumeForm)

export default {
  ResumeRegistration: WrappedRegistrationForm
}
