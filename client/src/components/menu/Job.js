import React, { Component } from 'react'
import Axios from 'axios'
import API from '../../util/api'
import JobForm from '../forms/JobForm'
import UpdateJobForm from '../forms/UpdateJobForm'
import {
  Button,
  Col,
  Divider,
  Icon,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Table,
  Tag,
  Tooltip
} from 'antd'
import Highlighter from 'react-highlight-words'

export default class Job extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      clickedData: [],
      data: [],
      pagination: {},
      selectedRowKeys: [],
      selectedRows: [],
      visible: false,
      updateVisible: false,
      detailVisible: false,
      detailTitle: 'Job Detail'
    }

    this.columns = [
      {
        title: '포지션 제목',
        dataIndex: 'title',
        width: '15%',
        ...this.getColumnSearchProps('title'),
        sorter: (a, b) => a.title.length - b.title.length,
        // sortOrder:
        //   this.state.sortedInfo.columnKey === 'title' &&
        //   this.state.sortedInfo.order
        onCell: this.cellClickEvent
      },
      {
        title: '포지션 회사',
        dataIndex: 'company',
        width: '15%',
        ...this.getColumnSearchProps('company'),
        onCell: this.cellClickEvent
      },
      {
        title: '포지션 상세',
        dataIndex: 'detail',
        width: '100',
        ...this.getColumnSearchProps('detail'),
        render: text => {
          var slicedText =
            text.length > 50 ? `${text.slice(0, 50)} (중략)` : text
          // text.length > 50 ? `${text.slice(0, 50)} ▼ 더 보기` : text
          return <span>{slicedText}</span>
        },
        onCell: this.cellClickEvent
      },
      {
        title: '키워드',
        dataIndex: 'keyword',
        ...this.getColumnSearchProps('keyword'),
        render: e => (
          <span>
            {e.split(', ').map(tag => (
              <Tag color="blue">{tag}</Tag>
            ))}
          </span>
        ),
        onCell: this.cellClickEvent
      },
      {
        title: '마지막 수정 일시',
        dataIndex: 'modified_date',
        width: '100',
        ...this.getColumnSearchProps('modified_date'),
        onCell: this.cellClickEvent
      },
      {
        title: 'Status',
        dataIndex: 'valid',
        filters: [
          {
            text: 'alive',
            value: 'alive'
          },
          {
            text: 'hold',
            value: 'hold'
          },
          {
            text: 'expired',
            value: 'expired'
          }
        ],
        filterMultiple: false,
        onFilter: (value, record) => record.valid.indexOf(value) === 0,
        render: e => (
          <span>
            {e.split(', ').map(tag => {
              let color
              if (tag === 'alive') color = 'geekblue'
              else if (tag === 'hold') color = 'purple'
              else if (tag === 'expired') color = 'gray'

              return <Tag color={color}>{tag}</Tag>
            })}
          </span>
        ),
        onCell: this.statusToggle
      }
    ]
  }

  cellClickEvent = record => ({
    onClick: () => {
      this.handleClick(record)
    }
  })

  statusToggle = record => ({
    onClick: () => {
      let validCheck
      if (record.valid === 'alive') validCheck = 'hold'
      else if (record.valid === 'hold') validCheck = 'expired'
      else if (record.valid === 'expired') validCheck = 'alive'
      Axios.post(API.deletePosition, {
        user_id: this.props.user_id,
        position_id: record.position_id,
        valid: validCheck
      }).then(res => {
        // sort 때문에 fetch 하면 무조건 내려감, 그래서... for user exp
        const positionDataIndex = this.state.data.findIndex(
          data => data.position_id === record.position_id
        )
        if (positionDataIndex !== -1) {
          const dataTempChange = this.state.data.slice()
          dataTempChange[positionDataIndex].valid = validCheck
          this.setState({
            positionCompany: dataTempChange
          })
        }
      })
    }
  })

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
    render: text =>
      text ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text && text.toString()}
        />
      ) : null
  })

  handleSearch = (selectedKeys, confirm) => {
    confirm()
    this.setState({ searchText: selectedKeys[0] })
  }

  handleReset = clearFilters => {
    clearFilters()
    this.setState({ searchText: '' })
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    Axios.post(API.getPosition, {
      user_id: this.props.user_id
    }).then(data => {
      const pagination = { ...this.state.pagination }
      // Read total count from server
      // pagination.total = data.totalCount
      console.log('data.data.result', data.data.result)

      let aliveArr = []
      let expiredArr = []
      let holdArr = []

      data.data.result.forEach(data => {
        if (data.valid === 'alive') aliveArr.push(data)
        if (data.valid === 'expired') expiredArr.push(data)
        if (data.valid === 'hold') holdArr.push(data)
      })

      aliveArr.sort((a, b) => {
        // descend
        return (
          new Date(b.modified_date).getTime() -
          new Date(a.modified_date).getTime()
        )
      })

      holdArr.sort((a, b) => {
        // descend
        return (
          new Date(b.modified_date).getTime() -
          new Date(a.modified_date).getTime()
        )
      })
      expiredArr.sort((a, b) => {
        // descend
        return (
          new Date(b.modified_date).getTime() -
          new Date(a.modified_date).getTime()
        )
      })
      const positionSort = aliveArr.concat(holdArr).concat(expiredArr)

      // console.log('positionSort', positionSort)

      this.setState({
        loading: false,
        data: positionSort,
        pagination
      })
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager
    })
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    })
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

  resetSelections = () => {
    setTimeout(() => {
      console.log('job-resetting row selection')
      this.setState({
        selectedRowKeys: []
      })
    }, 1000)
  }

  handleDeleteConfirm = async e => {
    await e.preventDefault()
    if (this.state.selectedRows.length === 1) {
      try {
        await Axios.post(API.deletePosition, {
          user_id: this.props.user_id,
          position_id: this.state.selectedRows[0].position_id,
          valid: 'expired'
        })
        await message.success(
          `${this.state.selectedRows[0].company} | ${
            this.state.selectedRows[0].title
          } 포지션이 삭제되었습니다.`
        )
        await this.fetch()
      } catch (err) {
        await message.error('failed to delete a position', err)
      }
    } else {
      try {
        let deletedPositions = []
        for (let i = 0; i < this.state.selectedRows.length; i++) {
          await deletedPositions.push(
            `${this.state.selectedRows[i].company} | ${
              this.state.selectedRows[i].title
            }`
          )
          await Axios.post(API.deletePosition, {
            user_id: this.props.user_id,
            position_id: this.state.selectedRows[i].position_id,
            valid: 'expired'
          })
        }
        await message.success(
          `${deletedPositions.join(', ')} 포지션이 삭제되었습니다.`
        )
        await this.fetch()
      } catch (err) {
        await message.error('failed to delete positions', err)
      }
    }
  }

  handleDeleteCancel = e => {
    message.error('Delete canceled.')
  }

  jobModal = () => (
    <div>
      <Modal
        title=""
        width="45%"
        visible={this.state.visible}
        onOk={this.handleModalOk}
        onCancel={this.handleModalCancel}
        footer={null}
      >
        <JobForm.JobRegistration
          selected={this.state.selectedRows}
          user_id={this.props.user_id}
          close={this.handleModalCancel}
          jobFetch={this.fetch}
          jobData={this.state.data}
        />
      </Modal>
    </div>
  )

  updateJobModal = () => (
    <div>
      <Modal
        title=""
        visible={this.state.updateVisible}
        onOk={this.handleUpdateModalOk}
        onCancel={this.handleUpdateModalCancel}
        footer={null}
      >
        <UpdateJobForm.UpdateJobRegistration
          user_id={this.props.user_id}
          close={this.handleUpdateModalCancel}
          selected={this.state.selectedRows[0]}
          jobFetch={this.fetch}
          jobData={this.state.data}
        />
      </Modal>
    </div>
  )

  detailJobModal = () => (
    <div>
      <Modal
        title={this.state.detailTitle}
        visible={this.state.detailVisible}
        onOk={this.handleDetailModalOk}
        onCancel={this.handleDetailModalCancel}
        footer={null}
        width="80%"
      >
        <Row style={{ textAlign: 'left' }}>
          <Col>
            <h3>[ Company ]</h3>
          </Col>
        </Row>
        <Row style={{ textAlign: 'left' }}>
          <Col span={20}>
            <p>{this.state.clickedData.company}</p>
          </Col>
        </Row>
        <Divider />
        <Row style={{ textAlign: 'left' }}>
          <Col span={20}>
            <h3>[ Position ]</h3>
          </Col>
        </Row>
        <Row style={{ textAlign: 'left' }}>
          <Col span={20}>
            <p>{this.state.clickedData.title}</p>
          </Col>
        </Row>
        <Divider />
        <Row style={{ textAlign: 'left' }}>
          <Col span={20}>
            <h3>[ Keywords ]</h3>
          </Col>
        </Row>
        <Row style={{ textAlign: 'left' }}>
          <Col span={20}>
            <p>{this.state.clickedData.keyword}</p>
          </Col>
        </Row>
        <Divider />
        <Row style={{ textAlign: 'left' }}>
          <Col span={20}>
            <h3>[ Detail ]</h3>
          </Col>
        </Row>
        <Row style={{ textAlign: 'left' }}>
          <Col span={20}>
            <p>{this.state.clickedData.detail}</p>
          </Col>
        </Row>
        <Divider />
        <Row style={{ textAlign: 'left' }}>
          <Col span={20}>
            <h3>[ Modified Date ]</h3>
          </Col>
        </Row>
        <Row style={{ textAlign: 'left' }}>
          <Col span={20}>
            <p>{this.state.clickedData.modified_date}</p>
          </Col>
        </Row>
      </Modal>
    </div>
  )

  handleClick = async clickedData => {
    await this.setState({ clickedData })
    await this.setState({
      detailTitle: `${clickedData.company} | ${
        clickedData.title
      } | ${clickedData.valid.toUpperCase()}`
    })
    await this.showDetailModal()
  }

  showModal = () => {
    this.setState({ visible: true })
  }

  handleModalOk = () => {
    this.setState({ visible: false })
  }

  handleModalCancel = () => {
    this.setState({ visible: false, selectedRowKeys: [] })
  }

  showUpdateModal = () => {
    this.setState({ updateVisible: true })
  }

  handleUpdateModalOk = () => {
    this.setState({ updateVisible: false })
  }

  handleUpdateModalCancel = () => {
    this.setState({ updateVisible: false, selectedRowKeys: [] })
  }

  showDetailModal = () => {
    this.setState({ detailVisible: true })
  }

  handleDetailModalOk = () => {
    this.setState({ detailVisible: false })
  }

  handleDetailModalCancel = () => {
    this.setState({ detailVisible: false, selectedRowKeys: [] })
  }

  render() {
    const rowSelection = {
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name
      })
    }
    const {
      visible,
      updateVisible,
      detailVisible,
      selectedRowKeys
    } = this.state
    const hasSelectedOne = selectedRowKeys.length === 1
    const hasSelectedMultiple = selectedRowKeys.length >= 1
    const editButtonToolTip = <span>편집을 위해서는 하나만 선택해주세요.</span>

    return (
      <div style={{ marginLeft: '20px' }}>
        <div style={{ marginTop: '16px', width: '85%' }}>
          <Button
            style={{ marginRight: 5, marginBottom: 16 }}
            type="primary"
            icon="user-add"
            onClick={this.showModal}
          >
            등록
          </Button>

          {hasSelectedMultiple ? (
            <Popconfirm
              title="Are you sure you want to delete this?"
              onConfirm={this.handleDeleteConfirm}
              onCancel={this.handleDeleteCancel}
              okText="OK"
              cancelText="Cancel"
              disabled={!hasSelectedMultiple}
            >
              <Button
                type="primary"
                icon="delete"
                style={{ marginRight: 5, marginBottom: 16 }}
                disabled={!hasSelectedMultiple}
              >
                삭제
              </Button>
            </Popconfirm>
          ) : (
            <Button
              type="primary"
              icon="delete"
              style={{ marginRight: 5, marginBottom: 16 }}
              disabled={!hasSelectedMultiple}
            >
              삭제
            </Button>
          )}

          <Tooltip
            placement="right"
            title={editButtonToolTip}
            visible={selectedRowKeys.length > 1}
          >
            <Button
              type="primary"
              icon="edit"
              onClick={this.showUpdateModal}
              style={{ marginRight: 5, marginBottom: 16 }}
              disabled={!hasSelectedOne}
            >
              편집
            </Button>
          </Tooltip>
        </div>
        {visible && <this.jobModal />}
        {updateVisible && <this.updateJobModal />}
        {detailVisible && <this.detailJobModal />}
        <Table
          columns={this.columns}
          bordered
          dataSource={this.state.data}
          rowKey="position_id"
          size="small"
          style={{ marginTop: '10px', width: '95%' }}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
          rowSelection={rowSelection}
          // onRow={record => ({

          //   onClick: () => {
          //     console.log('record', record)
          //     this.handleClick(record)
          //   }
          // })}
        />
      </div>
    )
  }
}
