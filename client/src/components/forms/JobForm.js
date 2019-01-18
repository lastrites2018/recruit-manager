import React from 'react'
import { Form, Input, Tooltip, Icon, Cascader, Select, Button, AutoComplete, } from 'antd'
const { Option } = Select
const AutoCompleteOption = AutoComplete.Option

const residences = [{
  value: '서울',
  label: '서울',
  children: [
      {value: '강남구', label: '강남구'},
      {value: '강동구', label: '강동구', 
      children: [{value: '강일동', label: '강일동'}]}
    ],
}]

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

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
          {...formItemLayout}
          label='Position'
        >
          {getFieldDecorator('position', {
            rules: [{
              type: 'position', message: 'Please fill in the position.',
            }, {
              required: true, message: 'Please fill in the position.',
            }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label='Team'
        >
          {getFieldDecorator('team', {
            rules: [{ required: true, message: 'Please fill in the team.' }],
          })(
            <AutoComplete
            >
              <Input />
            </AutoComplete>
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label='Notes'
        >
          {getFieldDecorator('notes')(
            <AutoComplete
            >
              <Input.TextArea rows={4} />
            </AutoComplete>
          )}
        </Form.Item>
        
        <Form.Item
            label='Age'
            {...formItemLayout}
            style={{ marginBottom: 0 }}
            >
            <Form.Item
                style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
            >
                <Input placeholder='25'/>
            </Form.Item>
            <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
                -
            </span>
            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                <Input placeholder='35'/>
            </Form.Item>
        </Form.Item>



        <Form.Item
          {...formItemLayout}
          label='Location'
        >
          {getFieldDecorator('residence', {
            initialValue: ['서울', '강동구', '강일동'],
            rules: [{ type: 'array', required: true, message: 'Please select a location.' }],
          })(
            <Cascader options={residences} />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label='Keywords'
        >
          {getFieldDecorator('keyword', {
            rules: [{ required: true, message: 'Please fill in the keyword.' }],
          })(
            <AutoComplete
            >
              <Input />
            </AutoComplete>
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>Register</Button>
        </Form.Item>
      </Form>
    )
  }
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm)

export default {
    JobRegistration: WrappedRegistrationForm
}