import React from 'react'
import Axios from 'axios'
import { Button, Form, Input, Select } from 'antd'
import API from '../../util/api'

class MemoForm extends React.Component {
  state = {
    newMemo: {}
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log('values', values)
      values.position =
        Array.isArray(values.position) && values.position.join('')
      if (!err)
        this.setState({ newMemo: values }, () => {
          this.writeMemo()
        })
    })
  }

  writeMemo = async () => {
    try {
      await console.log('update memo to this: ', this.state.newMemo)
      await console.log('update memo to this: ', this.props)
      await Axios.post(API.writeMemo, {
        user_id: this.props.user_id,
        rm_code: this.props.rm_code,
        client: this.state.newMemo.client,
        position: this.state.newMemo.position,
        body: this.state.newMemo.memo
      })

      await console.log('memo added')
      // await this.props.resetSelections()
      // await this.props.addSuccess()
      await this.props.handleMemoAddCancel()
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

  getResumeDetail(memoData) {
    if (memoData) {
      Axios.post(API.rmDetail, {
        user_id: memoData.user_id,
        rm_code: memoData.rm_code
      })
        .then(res => {
          console.log('this-setResumeDetail?', res.data.result)
          this.props.setResumeDetail(res.data.result)
          // this.setState({
          //   resumeDetailData: res.data.result
          // })
        })
        .catch(err => {
          console.log(err.response)
        })
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
    console.log('this.state.optionList', this.state.optionList)

    return (
      <Form onSubmit={this.handleSubmit}>
        {/* <Form.Item {...formItemLayout} label="Position">
          {getFieldDecorator('position', {
            // rules: [{ required: true, message: 'Please fill in the Position.' }]
          })(<Input />)}
        </Form.Item> */}

        <Form.Item label="Position" {...formItemLayout} hasFeedback>
          {getFieldDecorator('position', {
            rules: [
              {
                validator: this.checkPostionFieldLength
              }
            ]
          })(
            <Select
              showSearch
              mode="tags"
              // tokenSeparators={[',']}
              style={{ width: '90 %' }}
              optionFilterProp="children"
              // onChange={this.handlePositionTitleChange}
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

const WrappedRegistrationForm = Form.create({ name: 'write_memo' })(MemoForm)

export default {
  MemoRegistration: WrappedRegistrationForm
}
