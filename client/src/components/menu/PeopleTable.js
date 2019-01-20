import React from 'react'
import Axios from 'axios'
import { Button, Divider, Modal, Popconfirm, Table } from 'antd'
import { EditableFormRow, EditableCell } from '../../util/Table'
import API from '../../util/api'

class EditableTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      selectedRowKeys: [],
      manualKey: 0, // will need to change this later
      clickedData: [],
      visible: false,
      resumeDetailData: [],
      mailText: '',
      mailSubject: '',
      phoneNumber: '',
      SMSText: ''
    }

    this.columns = [
      {
        key: 'name',
        title: '이름',
        dataIndex: 'name'
      },
      {
        key: 'age',
        title: '나이',
        dataIndex: 'age'
      },
      {
        key: 'school',
        title: '최종학력',
        dataIndex: 'school'
      },
      {
        key: 'company',
        title: '주요직장',
        dataIndex: 'company'
      },
      {
        key: 'career',
        title: '총 경력',
        dataIndex: 'career'
      },
      {
        key: 'keyword',
        title: '핵심 키워드',
        dataIndex: 'keyword'
      },
      {
        key: 'resume_title',
        title: 'Resume Title',
        dataIndex: 'resume_title'
      },
      {
        key: 'salary',
        title: '연봉',
        dataIndex: 'salary'
      },
      {
        key: 'rate',
        title: 'Rate',
        dataIndex: 'rate'
      },
      {
        title: 'Action',
        dataIndex: '',
        // 이건 나중에 지워서 breadcrumb 으로 만들기
        // row 삭제 api 필요 예) delete/rm_code/10 이런식
        // 현재 row onClick 하면 모달이랑 같이 뜸.
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
              title="삭제?"
              onConfirm={() => this.handleDelete(record.key)}
            >
              <a href="javascript:">삭제</a>
            </Popconfirm>
          ) : null
      }
    ]
  }

  sendMail = () => {
    alert(`send Mail to [${this.state.selectedRowKeys}]`)
    // empty after sending mail
    setTimeout(() => {
      this.setState({
        selectedRowKeys: []
      })
    }, 1000)
  }

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    this.setState({ selectedRowKeys })
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource]
    this.setState({
      dataSource: dataSource.filter(item => item.key !== key)
    })
  }

  async getResumeDetail(rm_code) {
    if (rm_code) {
      // this.setState({
      //   loading: true
      // })
      await console.log('userid', this.props.user_id)
      await console.log('rm_code', rm_code)
      await Axios.post(API.rmDetail, {
        // user_id: this.props.user_id,
        // rm_id: rm_code
        user_id: 'rmrm',
        rm_id: 'linkedin_1'
      })
        .then(res => {
          console.log('getResumeDetail_res', res.data.result)
          this.setState({
            resumeDetailData: res.data.result
            // loading: false
          })
        })
        .catch(err => {
          console.log(err.response)
          this.setState({
            // loading: false
          })
        })
    }
  }

  handleClick = clickedData => {
    this.showModal()
    this.setState({ clickedData: clickedData })
    this.getResumeDetail(clickedData.rm_code)
  }

  fetch = () => {
    Axios.post(API.mainTable, {
      under_age: 0,
      upper_age: 90,
      top_school: false,
      keyword: '인폼'
    }).then(data => {
      const pagination = { ...this.state.pagination }
      // Read total count from server
      // pagination.total = data.totalCount
      pagination.total = 200
      this.setState({
        dataSource: data.data.result,
        pagination
      })
    })
  }

  async componentDidMount() {
    await this.fetch()
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource]
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) })
  }

  handleAdd = () => {
    const { count, dataSource, manualKey } = this.state
    const newData = {
      // uniq key 가 필요함 수정 필요!

      // Warning: Each record in table should have a unique `key` prop,
      // or set `rowKey` to an unique primary key.

      rowKey: this.state.manualKey, // unique key 값을 안 준다
      name: 'sunny',
      age: '100',
      school: 'uc berkeley',
      company: 'codestates'
    }
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
      manualKey: manualKey + 1
    })
  }

  handleSave = row => {
    const newData = [...this.state.dataSource]
    const index = newData.findIndex(item => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row
    })
    this.setState({ dataSource: newData })
  }

  showModal = () => {
    this.setState({ visible: true })
  }

  handleOk = () => {
    this.setState({ visible: false })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  peopleModal = () => (
    <div>
      <Modal
        title={this.state.clickedData.name}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <div>
          [School]
          <p>{this.state.clickedData.school}</p>
        </div>
        <Divider />
        <div>
          [Company]
          <p>{this.state.clickedData.company}</p>
        </div>
        <Divider />
      </Modal>
    </div>
  )

  render() {
    const { dataSource, selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    }
    const hasSelected = selectedRowKeys.length > 0
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    }
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      }
    })

    console.log('clicked data', this.state.clickedData)

    return (
      <div>
        <br />
        <Button
          onClick={this.handleAdd}
          type="primary"
          icon="user-add"
          style={{ marginRight: 5, marginBottom: 16 }}
        >
          등록
        </Button>
        <Button
          type="primary"
          icon="mail"
          onClick={this.sendMail}
          style={{ marginRight: 5 }}
          disabled={!hasSelected}
        >
          메일
        </Button>
        <Button
          type="primary"
          icon="message"
          style={{ marginRight: 5 }}
          disabled={!hasSelected}
        >
          SMS
        </Button>
        <p style={{ marginLeft: 8 }}>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
        </p>
        <Table
          components={components}
          rowKey="rm_code"
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          rowSelection={rowSelection}
          onRow={record => ({
            onClick: () => this.handleClick(record)
          })}
          columns={columns}
        />
        {this.state.visible && <this.peopleModal />}
        {/* <this.peopleModal /> */}
      </div>
    )
  }
}

export default EditableTable
