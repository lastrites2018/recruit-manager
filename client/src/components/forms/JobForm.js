import React from 'react'
import Axios from 'axios'
import { Button, Cascader, Form, Input } from 'antd'
import API from '../../util/api'

class JobForm extends React.Component {
  state = {
    newPosition: {}
  }


  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) this.setState({ newPosition: values })
    })
    this.addPosition()
  }

  addPosition = async () => {
    await console.log('newPosition: ', this.state.newPosition)
    try {
      await Axios.post(API.insertPosition, {
      user_id: this.props.user_id,
      company: this.state.newPosition.company,
      title: this.state.newPosition.position,
      detail: this.state.newPosition.notes,
      keyword: this.state.newPosition.keyword,
      valid: 'true',
      age_from: this.state.newPosition.min_age,
      age_to: this.state.newPosition.max_age
      })
      await console.log('position added')
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

    const residences = [
      {
        value: '서울',
        label: '서울',
        children: [
          {value: '강남구', label: '강남구'},
          {value: '강동구', label: '강동구'},
          {value: '강북구', label: '강북구'}, 
          {value: '강서구', label: '강서구'}, 
          {value: '관악구', label: '관악구'}, 
          {value: '구로구', label: '구로구'}, 
          {value: '금천구', label: '금천구'},
          {value: '노원구', label: '노원구'},
          {value: '도봉구', label: '도봉구'},
          {value: '동대문구', label: '동대문구'},
          {value: '동작구', label: '동작구'},
          {value: '마포구', label: '마포구'},
          {value: '서대문구', label: '서대문구'},
          {value: '서초구', label: '서초구'},
          {value: '성동구', label: '성동구'},
          {value: '성북구', label: '성북구'},
          {value: '송파구', label: '송파구'},
          {value: '양천구', label: '양천구'},
          {value: '영등포구', label: '영등포구'},
          {value: '용산구', label: '용산구'},
          {value: '은평구', label: '은평구'},
          {value: '종로구', label: '종로구'},
          {value: '중구', label: '중구'},
          {value: '중랑구', label: '중랑구'}],
        },
        { value: '서울 외', label: '서울 외' }]

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item
          {...formItemLayout}
          label='Position'
        >
          {getFieldDecorator('position', {
            rules: [{ required: true, message: 'Please fill in the position.' }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label='Company'
        >
          {getFieldDecorator('company', {
            rules: [{ required: true, message: 'Please fill in the company.' }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label='Notes'
        >
          {getFieldDecorator('notes', {
            initialValue: ''
          })(
            <Input.TextArea rows={4} />
          )}
        </Form.Item>
        
        <Form.Item
          label='Age'
          {...formItemLayout}
          style={{ marginBottom: 0 }}
          >
          <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
            {getFieldDecorator('min_age', {
              initialValue: 25,
              rules: [
                { type: 'number', message: 'Min age must be a number.'},
                { required: true, message: 'Please fill in the min age.' }]
            })(
            <Input />
            )}
          </Form.Item>
          <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
              -
          </span>
          <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
          {getFieldDecorator('max_age', {
            initialValue: 35,
            rules: [
              { type: 'number', message: 'Max age must be a number.'},
              { required: true, message: 'Please fill in the max age.' }]
          })(
            <Input />
            )}
          </Form.Item>
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label='Location'
        >
          {getFieldDecorator('residence', {
            initialValue: ['서울', '강남구'],
          })(
            <Cascader options={residences} />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label='Keywords'
        >
          {getFieldDecorator('keyword', {
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

const WrappedRegistrationForm = Form.create({ name: 'job' })(JobForm)

export default {
    JobRegistration: WrappedRegistrationForm
}