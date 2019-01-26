import React, { Component } from 'react'
import Axios from 'axios'
import API from '../../util/api'
import MailForm from '../forms/MailForm'
import { EditableFormRow, EditableCell } from '../../util/Table'
import 'react-table/react-table.css'
import './menu.css'
import {
  Modal,
  Input,
  Select,
  Button,
  Checkbox,
  Divider,
  Table,
  Icon
} from 'antd'
import Highlighter from 'react-highlight-words'

export default class People extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mail: {},
      minAge: '',
      maxAge: '',
      isTopSchool: false,
      position: '',
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      manualKey: 0, // will need to change this later
      clickedData: [],
      visible: false,
      resumeDetailData: [],
      mailVisible: false,
      mailText: '',
      mailSubject: '',
      phoneNumber: '',
      SMSText: '',
      searchText: '',
      selected: '',
      andOr: ''
    }

    this.columns = [
      {
        key: 'name',
        title: '이름',
        dataIndex: 'name',
        align: 'center',
        ...this.getColumnSearchProps('name')
      },
      {
        key: 'age',
        title: '나이',
        dataIndex: 'age',
        width: 75,
        align: 'center',
        ...this.getColumnSearchProps('age')
      },
      {
        key: 'school',
        title: '최종학력',
        dataIndex: 'school',
        align: 'center',
        ...this.getColumnSearchProps('school')
      },
      {
        key: 'company',
        title: '주요직장',
        dataIndex: 'company',
        align: 'center',
        ...this.getColumnSearchProps('company')
      },
      {
        key: 'career',
        title: '총 경력',
        dataIndex: 'career',
        align: 'center',
        ...this.getColumnSearchProps('career')
      },
      {
        key: 'keyword',
        title: '핵심 키워드',
        dataIndex: 'keyword',
        align: 'center',
        ...this.getColumnSearchProps('keyword')
      },
      {
        key: 'resume_title',
        title: 'Resume Title',
        dataIndex: 'resume_title',
        align: 'center',
        width: 130,
        ...this.getColumnSearchProps('resume_title')
      },
      {
        key: 'salary',
        title: '연봉',
        dataIndex: 'salary',
        width: 120,
        ...this.getColumnSearchProps('salary')
      },
      {
        key: 'rate',
        title: 'Rate',
        dataIndex: 'rate',
        sorter: (a, b) => a.rate - b.rate,
        sortOrder: 'descend',
        width: 60,
        align: 'center',
        ...this.getColumnSearchProps('rate')
      },
      {
        key: 'url',
        title: 'URL',
        dataIndex: 'url',
        width: 50,
        render: (text, row, index) => {
          return (
            <a href={text} target="_blank" onClick={this.handleCancel}>
              URL
            </a>
          )
        }
      }
      // {
      //   title: 'Action',
      //   dataIndex: '',
      //   // 이건 나중에 지워서 breadcrumb 으로 만들기
      //   // row 삭제 api 필요 예) delete/rm_code/10 이런식
      //   // 현재 row onClick 하면 모달이랑 같이 뜸.
      //   render: (text, record) =>
      //     this.state.dataSource.length >= 1 ? (
      //       <Popconfirm
      //         title="삭제?"
      //         onConfirm={() => this.handleDelete(record.key)}
      //       >
      //         <a href="javascript:">삭제</a>
      //       </Popconfirm>
      //     ) : null
      // }
    ]
  }

  showMailModal = () => {
    this.setState({ mailVisible: true })
  }

  handleMailOk = () => {
    this.setState({ mailVisible: false })
  }

  handleMailCancel = () => {
    this.setState({ mailVisible: false })
  }

  writeMailContent = form => {
    this.setState({ mail: form })
    this.sendMail()
    this.handleMailCancel()
  }

  mailModal = () => (
    <div>
      <Modal
        title="Mail"
        visible={this.state.mailVisible}
        onOk={this.handleMailOk}
        onCancel={this.handleMailCancel}
        footer={null}
      >
        <MailForm.MailRegistration
          selectedRows={this.state.selectedRows}
          mail={this.writeMailContent}
        />
      </Modal>
    </div>
  )

  sendMail = async () => {
    await console.log(this.state.selectedRowKey, this.state.selectedRows)
    await console.log('preparing to send')
    if (this.state.selectedRowKeys.length === 1) {
      try {
        await Axios.post(API.sendMail, {
          user_id: this.props.user_id,
          rm_code: this.state.selectedRows[0].rm_code,
          sender: 'rmrm.help@gmail.com',
          recipient: 'sungunkim367@gmail.com',
          subject: 'single mail',
          body: 'single mail',
          position: ''
        })
        await alert(`메일을 ${this.state.selectedRowKeys}에게 보냈습니다.`)
        // await this.resetSelections()
      } catch (err) {
        console.log('send one email error', err)
      }
    } else {
      try {
        for (let i = 0; i < this.state.selectedRowKeys.length; i++) {
          await setTimeout(() => {
            Axios.post(API.sendMail, {
              user_id: this.props.user_id,
              rm_code: this.state.selectedRows[0].rm_code,
              sender: 'rmrm.help@gmail.com',
              recipient: 'sungunkim367@gmail.com',
              subject: `multiple${i}`,
              body: `multiple${i}`,
              position: ''
            })
          }, 100)
        }
        await alert(`메일을 ${this.state.selectedRowKeys}에게 보냈습니다.`)
        // await this.resetSelections()
      } catch (err) {
        console.log('send multiple emails error', err)
      }
    }
  }

  sendSMS = async () => {
    await console.log('selected rows: ', this.state.selectedRowKeys)
    await console.log('preparing to send')
    if (this.state.selectedRowKeys.length === 1) {
      try {
        await Axios.post(API.sendSMS, {
          user_id: this.props.user_id,
          rm_code: this.state.selectedRowKeys[0],
          recipient: '01072214890',
          body: 'single text',
          position: 'KT|자연어처리'
        })
        await alert(`문자를 ${this.state.selectedRowKeys}에게 보냈습니다.`)
        await this.resetSelections()
      } catch (err) {
        console.log('send one SMS error', err)
      }
    } else {
      try {
        for (let i = 0; i < this.state.selectedRowKeys.length; i++) {
          await setTimeout(() => {
            Axios.post(API.sendSMS, {
              user_id: this.props.user_id,
              rm_code: this.state.selectedRowKeys[i],
              recipient: '01072214890',
              body: `multiple texts${i}`,
              position: 'KT|자연어처리'
            })
          }, 100)
        }
        await alert(`문자를 ${this.state.selectedRowKeys}에게 보냈습니다.`)
        await this.resetSelections()
      } catch (err) {
        console.log('sending multiple SMS error', err)
      }
    }
  }

  resetSelections = () => {
    setTimeout(() => {
      console.log('resetting row selection')
      this.setState({
        selectedRowKeys: []
      })
    }, 2000)
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows
    )
    this.setState({
      selectedRowKeys: selectedRowKeys,
      selectedRows: selectedRows
    })
  }

  async getResumeDetail(rm_code) {
    if (rm_code) {
      await console.log('userid', this.props.user_id)
      await console.log('rm_code', rm_code)
      await Axios.post(API.rmDetail, {
        user_id: this.props.user_id,
        rm_code
        // rm_code: 'incrute_2018080595872'
      })
        .then(res => {
          console.log('getResumeDetail_res', res.data.result)
          this.setState({
            resumeDetailData: res.data.result
          })
        })
        .catch(err => {
          console.log(err.response)
        })
    }
  }

  handleClick = async clickedData => {
    await this.getResumeDetail(clickedData.rm_code)
    await this.showModal()
    await this.setState({ clickedData: clickedData })
  }

  fetch = () => {
    Axios.post(API.mainTable, {
      user_id: this.props.user_id,
      under_age: 0,
      upper_age: 90,
      top_school: false,
      keyword: ''
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

  //send input data
  fetchAgain = () => {
    const { minAge, maxAge, isTopSchool, position, andOr } = this.state
    Axios.post(API.viewMainTablePosition, {
      user_id: this.props.user_id,
      under_age: Number(minAge) || 0,
      upper_age: Number(maxAge) || 90,
      top_school: isTopSchool,
      keyword: andOr
    }).then(data => {
      const pagination = { ...this.state.pagination }
      pagination.total = 200
      this.setState({
        dataSource: data.data.result,
        pagination
      })
    })
  }

  checkTopschool = e => {
    console.log(`isTopSchool === ${e.target.checked}`)
    this.setState({ isTopSchool: e.target.checked })
  }

  handlePositionChange = value => {
    this.setState({ position: value })
  }

  handleAgeChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = () => {
    this.fetchAgain()
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

  handleSearchReset = () => {
    this.handleClearSelected()
    this.fetch()
  }

  // handleSelectChange = value => {
  //   this.setState({ selected: value })
  // }

  handleClearSelected = () => {
    this.setState({ position: null })
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
          <p>{this.state.resumeDetailData[0].school}</p>
          {/* <p>{this.state.clickedData.school}</p> */}
        </div>
        <Divider />
        <div>
          [Company]
          <p>{this.state.resumeDetailData[0].company}</p>
        </div>
        {/* <this.memoTable /> */}
        <Divider />
      </Modal>
    </div>
  )

  // memoTable = () => {
  //   //temp

  //   const columns = [
  //     {
  //       title: 'Client',
  //       dataIndex: 'client'
  //     },
  //     {
  //       title: 'Date',
  //       dataIndex: 'date'
  //     },
  //     {
  //       title: 'Text',
  //       dataIndex: 'text'
  //     },
  //     {
  //       title: 'Username',
  //       dataIndex: 'username'
  //     }
  //   ]

  //   console.log('tp', this.state.resumeDetailData[0])

  //   // if (!this.state.resumeDetailData[0].memo) {
  //   //   return
  //   // }

  //   // const datas = this.state.resumeDetailData[0].map(data => {
  //   //   return {
  //   //     client: data.memo.client,
  //   //     date: data.memo.date,
  //   //     position: data.memo.position,
  //   //     text: data.memo.text,
  //   //     username: data.memo.username
  //   //     // memo_client: "강남상사"
  //   //     // memo_date: "2019-01-24"
  //   //     // memo_position: "추천을 하려고 했었음 확인"
  //   //     // memo_text: "경리"
  //   //     // memo_username: "username"
  //   //   }
  //   // })
  //   return (
  //     <div>
  //       <h4>Middle size table</h4>
  //       {/* <Table columns={columns} dataSource={datas} size="middle" />
  //       <h4>Small size table</h4>
  //       <Table columns={columns} dataSource={datas} size="small" /> */}
  //     </div>
  //   )
  // }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select())
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text && text.toString()}
      />
    )
  })

  handleSearch = (selectedKeys, confirm) => {
    confirm()
    this.setState({ searchText: selectedKeys[0] })
  }

  handleReset = clearFilters => {
    clearFilters()
    this.setState({ searchText: '' })
  }

  handleAndOR = searchWords => {
    this.setState({ andOr: searchWords })
  }

  filterAndOr = () => {}

  async componentDidMount() {
    console.log('fetch!!')
    await this.fetch()
  }

  render() {
    const InputGroup = Input.Group
    const Option = Select.Option

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

    // console.log('clicked data', this.state.clickedData)

    return (
      <div>
        <br />
        <InputGroup compact>
          <Input
            style={{
              marginLeft: '20px',
              width: '5%'
            }}
            placeholder="min age"
            maxLength={2}
            name="minAge"
            onChange={this.handleAgeChange}
          />
          <Input
            style={{
              width: '5%'
            }}
            placeholder="max age"
            maxLength={2}
            name="maxAge"
            onChange={this.handleAgeChange}
          />
          <Checkbox
            style={{ marginLeft: '30px' }}
            onChange={this.checkTopschool}
          >
            Top School
          </Checkbox>
        </InputGroup>
        <br />
        <Input
          style={{ marginLeft: '20px', width: '20%' }}
          placeholder="검색어 (And, Or)"
          onChange={this.handleAndOR}
        />
        <br />
        <Select
          value={this.state.position}
          showSearch
          style={{ marginTop: '1px', marginLeft: '20px', width: '30%' }}
          optionFilterProp="children"
          onChange={this.handlePositionChange}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          <Option value="개발자">개발자</Option>
          <Option value="매니저">매니저</Option>
          <Option value="프론트엔드">프론트엔드</Option>
          <Option value="백엔드">백엔드</Option>
        </Select>
        <Button
          style={{ marginLeft: '10px' }}
          type="primary"
          icon="search"
          onClick={this.handleSubmit}
        >
          Search
        </Button>
        <Button
          style={{ marginLeft: '10px' }}
          type="primary"
          onClick={this.handleSearchReset}
        >
          Reset
        </Button>

        <br />
        <div style={{ marginLeft: '20px' }}>
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
            onClick={this.showMailModal}
            style={{ marginRight: 5 }}
            disabled={!hasSelected}
          >
            메일
          </Button>
          <Button
            type="primary"
            icon="message"
            onClick={this.sendSMS}
            style={{ marginRight: 5 }}
            disabled={!hasSelected}
          >
            SMS
          </Button>
          <p style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </p>
          <Table
            columns={columns}
            bordered
            style={{ width: '85%' }}
            dataSource={dataSource}
            components={components}
            rowKey="rm_code"
            rowClassName={() => 'editable-row'}
            rowSelection={rowSelection}
            onRow={record => ({
              onClick: () => this.handleClick(record)
            })}
          />
          {this.state.visible && <this.peopleModal />}
          <this.mailModal />
        </div>
      </div>
    )
  }
}
