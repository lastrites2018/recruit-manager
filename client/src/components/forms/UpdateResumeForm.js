import React from 'react'
import Axios from 'axios'
import { Button, Form, Input } from 'antd'
import API from '../../util/api'

class UpdateResumeForm extends React.Component {
  state = {
    newResume: {}
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err)
        this.setState({ newResume: values }, () => {
          this.updateResume()
        })
    })
  }

  updateResume = async () => {
    console.log('updateResume!!!!! 접근')
    try {
      await console.log('update resume to this: ', this.state.newResume)
      await console.log('error', this.state.newResume.birth_year)
      await Axios.post(API.updateResume, {
        user_id: this.props.user_id,
        rm_code: this.props.selected[0].rm_code,
        name: this.state.newResume.name,
        birth: this.state.newResume.birth_year,
        // gender: this.state.newResume.gender,
        // mobile: this.state.newResume.mobile,
        email: this.state.newResume.email, // 혹은 이메일 문제!
        address: this.state.newResume.address || '', // 어드레스 문제?
        job_keyword: this.state.newResume.keywords,
        job_title: this.state.newResume.job_title,
        educational_history: this.state.newResume.educational_history,
        career_history: this.state.newResume.career_history,
        salary_requirement: this.state.newResume.salary_requirement,
        working_area: this.state.newResume.working_area || '',
        // salary_requirement: 'yes!',
        // working_area: 'null'
        // name: '타마고',
        // birth: '1900',
        gender: '남',
        mobile: '01072214890'
        // email: 'sungunkim367@gmail.com',
        // address: 'null'
        // job_keyword: 'fetch bark',
        // job_title: 'doga'
        // educational_history: 'behavior school',
        // career_history: 'stayhome dog',
        // working_area: 'null'
      })
      await console.log('resume updated')
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
              initialValue: this.props.selected[0].name,
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
              initialValue: this.props.selected[0].age,
              rules: [
                { required: true, message: 'Please fill in the birth year.' }
              ]
            })(<Input placeholder="1993" />)}
          </Form.Item>
          <Form.Item
            style={{ display: 'inline-block', width: 'calc(25% - 12px)' }}
          >
            {getFieldDecorator('gender', {
              initialValue: this.props.selected[0].gender,
              rules: [{ type: 'string', message: 'Gender must be a number.' }]
            })(<Input placeholder="남/여" />)}
          </Form.Item>
        </Form.Item>

        <Form.Item {...formItemLayout} label="Mobile">
          {getFieldDecorator('mobile', {
            initialValue: this.props.selected[0].mobile,
            rules: [{ required: true, message: 'Please fill in the mobile.' }]
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Email">
          {getFieldDecorator('email', {
            initialValue: this.props.selected[0].email,
            rules: [{ required: true, message: 'Please fill in the email.' }]
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Keywords">
          {getFieldDecorator('keywords', {
            initialValue: this.props.selected[0].keyword,
            rules: [{ required: true, message: 'Please fill in the keywords.' }]
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Job Title">
          {getFieldDecorator('job_title', {
            initialValue: this.props.selected[0].resume_title,
            rules: [
              { required: true, message: 'Please fill in the job title.' }
            ]
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Education History">
          {getFieldDecorator('educational_history', {
            initialValue: this.props.selected[0].school
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Career History">
          {getFieldDecorator('career_history', {
            initialValue: this.props.selected[0].career
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Salary Requirement">
          {getFieldDecorator('salary_requirement', {
            initialValue: this.props.selected[0].salary
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Working Area">
          {getFieldDecorator('working_area', {
            initialValue: this.props.selected[0].working_area
          })(<Input />)}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const WrappedRegistrationForm = Form.create({ name: 'update_resume' })(
  UpdateResumeForm
)

export default {
  UpdateResumeRegistration: WrappedRegistrationForm
}
