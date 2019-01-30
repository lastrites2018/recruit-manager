import React from 'react'
import Axios from 'axios'
import { Button, Form, Input } from 'antd'
import API from '../../util/api'

class UpdateJobForm extends React.Component {
  state = {
    newPosition: {}
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) this.setState({ newPosition: values })
    })
    this.updatePosition()
  }

  updatePosition = async () => {
    // come back after API is fixed
    await console.log('selected props: ', this.props.selected.position_id)
    await console.log('user_id: ', this.props.user_id)
    await console.log('updatePosition: ', this.state.newPosition)
    try {
      await Axios.post(API.updatePosition, {
        user_id: this.props.user_id,
        position_id: this.props.selected.position_id,
        company: this.state.newPosition.company,
        title: this.state.newPosition.position,
        detail: this.state.newPosition.notes,
        keyword: this.state.newPosition.keyword,
        valid: true
      })
      await console.log('position added')
      await this.props.close()
      await this.props.jobFetch()
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
      <Form onSubmit={this.handleSubmit}>
        <Form.Item {...formItemLayout} label="Position">
          {getFieldDecorator('position', {
            initialValue: this.props.selected.title,
            rules: [{ required: true, message: 'Please fill in the position.' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Company">
          {getFieldDecorator('company', {
            initialValue: this.props.selected.company,
            rules: [{ required: true, message: 'Please fill in the company.' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Notes">
          {getFieldDecorator('notes', {
            initialValue: this.props.selected.detail
          })(<Input.TextArea rows={4} />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Keywords">
          {getFieldDecorator('keyword', {
            initialValue: this.props.selected.keyword
          })(
            <Input placeholder="키워드가 여러 개인 경우 한 칸 띄고 입력해주세요." />
            // tag 기능 제대로 쓸려면 키워드도 array로 받거나 기호를 사이에 넣어서 저장하고 가져오면 분할하던가 해줘야할듯.
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Status">
          {getFieldDecorator('status', {
            initialValue: this.props.selected.valid,
            rules: [{ required: true, message: 'Please fill in the status.' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Edit
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const WrappedRegistrationForm = Form.create({ name: 'updateJob' })(
  UpdateJobForm
)

export default {
  UpdateJobRegistration: WrappedRegistrationForm
}
