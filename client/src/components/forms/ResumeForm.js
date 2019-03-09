import React from 'react'
import Axios from 'axios'
import { Button, Form, Input, Select } from 'antd'
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
    try {
      await console.log('newResume', this.state.newResume)
      await Axios.post(API.insertResume, {
        user_id: this.props.user_id,
        name: this.state.newResume.name,
        birth: this.state.newResume.birth_year,
        gender: this.state.newResume.gender,
        mobile: this.state.newResume.mobile,
        email: this.state.newResume.email || '',
        address: this.state.newResume.address || '',
        job_keyword: this.state.newResume.keywords || '',
        job_title: this.state.newResume.job_title || '',
        educational_history: this.state.newResume.educational_history || '',
        career_history: this.state.newResume.career_history || '',
        salary_requirement: this.state.newResume.salary_requirement || '',
        working_area: this.state.newResume.working_area || ''
      }).then(res => {
        console.log('resume added')
        this.props.addSuccess()
      })
      await this.props.peopleFetch()
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
    const { Option } = Select

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
            })(<Input placeholder="1993" maxLength={4} />)}
          </Form.Item>
          {/* <Form.Item
            style={{ display: 'inline-block', width: 'calc(25% - 12px)' }}
          >
            {getFieldDecorator('gender', {
              rules: [{ type: 'string', message: 'Gender must be a string.' }]
            })(<Input placeholder="남/여" />)}
          </Form.Item> */}
          <Form.Item
            hasFeedback
            style={{ display: 'inline-block', width: 'calc(25% - 12px)' }}
          >
            {getFieldDecorator('gender', {
              rules: [
                { required: false, message: 'Please fill in the gender.' }
              ]
            })(
              <Select defaultValue="모름">
                {/* <Select defaultValue="모름" style={{ width: 60 }}> */}
                <Option value="남">남</Option>
                <Option value="여">여</Option>
                <Option value="모름">모름</Option>
              </Select>
            )}
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

const WrappedRegistrationForm = Form.create({ name: 'upload_resume' })(
  ResumeForm
)

export default {
  ResumeRegistration: WrappedRegistrationForm
}
