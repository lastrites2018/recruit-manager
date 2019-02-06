import React from 'react'
import Axios from 'axios'
import { Button, Cascader, Form, Input, message } from 'antd'
import API from '../../util/api'
import { throttle } from 'lodash'

class JobForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      newPosition: {},
      positionTitleStatus: ''
    }
    this.handlePositionTitleChange = this.handlePositionTitleChange.bind(this) // binding this because onChange is called in another scope
    this.throttledOnChange = throttle(this.throttledOnChange.bind(this), 200) // debouncing function to 200ms and binding this
  }

  handlePositionTitleChange(event) {
    this.throttledOnChange(event.target.value) // sending only the values not the entire event
  }

  throttledOnChange(value) {
    if (this.props.jobData.some(data => data.title === value)) {
      this.setState({ positionTitleStatus: 'error' })
      return
    }
    this.setState({ positionTitleStatus: 'success' })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log('register-job', values)
      // if (!err) this.setState({ newPosition: values })
      if (!err && this.state.positionTitleStatus !== 'error')
        this.setState({ newPosition: values }, () => {
          this.addPosition()
        })
    })
    // this.addPosition()
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
        valid: 'alive',
        under_birth: this.state.newPosition.under_birth,
        upper_birth: this.state.newPosition.upper_birth
      })
      await console.log('position added')
      await this.props.close()
      await this.props.jobFetch()
      await message.success('Job Position has been added!')
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

    const residences = [
      {
        value: '서울',
        label: '서울',
        children: [
          { value: '강남구', label: '강남구' },
          { value: '강동구', label: '강동구' },
          { value: '강북구', label: '강북구' },
          { value: '강서구', label: '강서구' },
          { value: '관악구', label: '관악구' },
          { value: '구로구', label: '구로구' },
          { value: '금천구', label: '금천구' },
          { value: '노원구', label: '노원구' },
          { value: '도봉구', label: '도봉구' },
          { value: '동대문구', label: '동대문구' },
          { value: '동작구', label: '동작구' },
          { value: '마포구', label: '마포구' },
          { value: '서대문구', label: '서대문구' },
          { value: '서초구', label: '서초구' },
          { value: '성동구', label: '성동구' },
          { value: '성북구', label: '성북구' },
          { value: '송파구', label: '송파구' },
          { value: '양천구', label: '양천구' },
          { value: '영등포구', label: '영등포구' },
          { value: '용산구', label: '용산구' },
          { value: '은평구', label: '은평구' },
          { value: '종로구', label: '종로구' },
          { value: '중구', label: '중구' },
          { value: '중랑구', label: '중랑구' }
        ]
      },
      { value: '서울 외', label: '서울 외' }
    ]

    return (
      <Form onSubmit={this.handleSubmit} layout="vertical">
        <Form.Item
          {...formItemLayout}
          help={
            this.state.positionTitleStatus === 'error'
              ? '이미 존재하는 포지션 제목입니다.'
              : null
          }
          validateStatus={this.state.positionTitleStatus}
          hasFeedback
          label="Position"
        >
          {getFieldDecorator('position', {
            rules: [{ required: true, message: 'Please fill in the position.' }]
          })(<Input onChange={this.handlePositionTitleChange} id="success" />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Company">
          {getFieldDecorator('company', {
            rules: [{ required: true, message: 'Please fill in the company.' }]
          })(<Input />)}
        </Form.Item>

        <Form.Item label="Notes">
          {/* <Form.Item {...formItemLayout} label="Notes"> */}
          {getFieldDecorator('notes', {
            initialValue: ''
          })(
            <Input.TextArea rows={4} autosize={{ minRows: 4, maxRows: 35 }} />
          )}
        </Form.Item>

        <Form.Item
          label="Birth Year"
          {...formItemLayout}
          style={{ marginBottom: 0 }}
        >
          <Form.Item
            style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
          >
            {getFieldDecorator('under_birth', {
              initialValue: 1900,
              rules: [{ type: 'number' }, { required: true }]
            })(<Input />)}
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
            {getFieldDecorator('upper_birth', {
              initialValue: 2100,
              rules: [{ type: 'number' }, { required: true }]
            })(<Input />)}
          </Form.Item>
        </Form.Item>

        <Form.Item {...formItemLayout} label="Location">
          {getFieldDecorator('residence', {
            initialValue: ['서울', '강남구']
          })(<Cascader options={residences} />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Keywords">
          {getFieldDecorator('keyword', {
            initialValue: ''
          })(
            <Input placeholder="키워드가 여러 개인 경우 ,를 넣고 한 칸 띄워주세요." />
            // tag 기능 제대로 쓸려면 키워드도 array로 받거나 기호를 사이에 넣어서 저장하고 가져오면 분할하던가 해줘야할듯.
          )}
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

const WrappedRegistrationForm = Form.create({ name: 'job' })(JobForm)

export default {
  JobRegistration: WrappedRegistrationForm
}
