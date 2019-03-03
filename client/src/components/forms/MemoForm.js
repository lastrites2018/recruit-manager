import React from 'react'
import Axios from 'axios'
import { Button, Form, Input } from 'antd'
import API from '../../util/api'

class MemoForm extends React.Component {
  state = {
    newMemo: {}
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log('values', values)
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
      // "user_id":"rmrm_2",
      // "rm_code":"linkedin_1",
      // "client":"강남상사",
      // "position":"경리",
      // "body":"추천을 하려고 했었음"

      // name: this.state.newMemo.name,
      // birth: this.state.newMemo.birth_year,
      // gender: this.state.newMemo.gender,
      // mobile: this.state.newMemo.mobile,

      await console.log('memo added')
      // await this.props.resetSelections()
      // await this.props.peopleFetch()
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

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item {...formItemLayout} label="Position">
          {getFieldDecorator('position', {
            // rules: [{ required: true, message: 'Please fill in the Position.' }]
          })(<Input />)}
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

const WrappedRegistrationForm = Form.create({ name: 'update_rmemo' })(MemoForm)

export default {
  MemoRegistration: WrappedRegistrationForm
}
