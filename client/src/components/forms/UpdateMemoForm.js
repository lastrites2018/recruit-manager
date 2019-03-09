import React from 'react'
import Axios from 'axios'
import { Button, Form, Input, Select } from 'antd'
import API from '../../util/api'

class UpdateMemoForm extends React.Component {
  state = {
    updateMemo: {}
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log('values', values)
      values.position =
        Array.isArray(values.position) && values.position.join('')
      if (!err)
        this.setState({ updateMemo: values }, () => {
          this.updateMemo()
        })
    })
  }

  updateMemo = async () => {
    try {
      await console.log('update memo to this: ', this.state.updateMemo)
      await console.log('update memo to this: ', this.props)
      await Axios.post(API.updateMemo, {
        user_id: this.props.user_id,
        rm_code: this.props.rm_code,
        client: this.state.updateMemo.client,
        position: this.state.updateMemo.position,
        body: this.state.updateMemo.memo,
        memo_id: String(this.props.memoRecord.memo_id)
      })

      await console.log('memo updated')
      // await this.props.resetSelections()
      // await this.props.addSuccess()
      await this.props.handleUpdateMemoCancel()
      const memoData = await {
        user_id: this.props.user_id,
        rm_code: this.props.rm_code
      }
      await this.props.getResumeDetail(this.props.rm_code, memoData)
      // await this.getResumeDetail(memoData)
    } catch (err) {
      console.log(err)
    }
  }

  checkPostionFieldLength = (rule, value, callback) => {
    if (value && Array.isArray(value) && value.join('').length > 100) {
      callback('position 필드의 글자 수는 100자를 넘을 수 없습니다.')
    } else {
      callback()
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
        {/* <Form.Item {...formItemLayout} label="Position">
          {getFieldDecorator('position', {
            initialValue: this.props.memoRecord.position
            // rules: [{ required: true, message: 'Please fill in the Position.' }]
          })(<Input />)}
        </Form.Item> */}

        <Form.Item label="Position" {...formItemLayout} hasFeedback>
          {getFieldDecorator('position', {
            initialValue: this.props.memoRecord.position,
            rules: [
              {
                validator: this.checkPostionFieldLength
              }
            ]
          })(
            <Select
              showSearch
              mode="tags"
              style={{ width: '90 %' }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {this.props.optionList}
            </Select>
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Client">
          {getFieldDecorator('client', {
            initialValue: this.props.memoRecord.client_name
            // rules: [{ required: true, message: 'Please fill in the Client.' }]
          })(<Input />)}
        </Form.Item>

        {/* <Form.Item {...formItemLayout} label="담당 헤드 헌터">
          {getFieldDecorator('id', {
            rules: [{ required: true, message: 'Please fill in the id.' }]
          })(<Input />)}
        </Form.Item> */}

        <Form.Item {...formItemLayout} label="메모">
          {getFieldDecorator('memo', {
            initialValue: this.props.memoRecord.note,
            rules: [{ required: true, message: 'Please fill in the Memo.' }]
          })(
            <Input.TextArea rows={4} autosize={{ minRows: 4, maxRows: 15 }} />
          )}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            메모 등록
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const WrappedRegistrationForm = Form.create({ name: 'update_memo' })(
  UpdateMemoForm
)

export default {
  UpdateMemoRegistration: WrappedRegistrationForm
}
