import React, { Component } from 'react'
import Axios from 'axios'
import API from '../../util/api'
import { Spin } from 'antd'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import './menu.css'
import {
  Container,
  Grid,
  Modal,
  Checkbox,
  Form,
  Breadcrumb,
  Button,
  Header,
  Icon,
  Dropdown,
  Input,
  TextArea
} from 'semantic-ui-react'

export default class Job extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      peopleData: [],
      isAppendModalOpen: false,
      isDeleteModalOpen: false,
      isEditModalOpen: false,
    }
  }

  _openAppendModal = () => this.setState({ isAppendModalOpen: true })
  _closeAppendModal = () => this.setState({ isAppendModalOpen: !this.state.isAppendModalOpen })

  _openDeleteModal = () => this.setState({ isDeleteModalOpen: true })
  _closeDeleteModal = () => this.setState({ isDeleteModalOpen: !this.state.isDeleteModalOpen })

  _openEditModal = () => this.setState({ isEditModalOpen: true })
  _closeEditModal = () => this.setState({ isEditModalOpen: !this.state.isEditModalOpen })

  _handleAppend = () => {
    // 등록을 눌렀을 때
    console.log('append')
    this._closeAppendModal()
  }

  _handleAppendSubmit = () => {
    console.log('appended!')
    this._closeAppendModal()
  }

  _handleDelete = () => {
    // 삭제를 눌렀을 때
    console.log('delete')
    this._closeDeleteModal()
  }

  _handleDontDelete = () => {
    // 삭제 하려다가 안 했을 때
    console.log('don\t delete')
    this._closeDeleteModal()
  }

  _handleEdit = () => {
    // 편집을 눌렀을 때
    console.log('edit')
    this._closeEditModal()
  }

  JobModalDelete = () => (
    <Modal
      open={this.state.isDeleteModalOpen}
      onClose={this._closeDeleteModal}
      closeOnDimmerClick={false}
    >
    <Header icon='archive' content='삭제' />
    <Modal.Content>
      <p>정말 삭제 하시겠습니까?</p>
    </Modal.Content>
    <Modal.Actions>
      <Button
        onClick={this._handleDontDelete}
        color='red'
        inverted>
        <Icon name='remove' /> No
      </Button>
      <Button
        onClick={this._handleDelete}
        color='green'
        inverted
        >
        <Icon name='checkmark' /> Yes
      </Button>
    </Modal.Actions>
  </Modal>
  )

  JobModalAppend = () => (
    <Modal
      open={this.state.isAppendModalOpen}
      onClose={this._closeAppendModal}
      closeOnDimmerClick={false}
    >
    <Modal.Header>등록</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Input
          label='Position'
          required
          placeholder='Java 개발자 (과장급)'
        />
        <Form.Input
          label='Team'
          required
          placeholder='Naver Clova 팀'
        />
        <Form.TextArea
          label='Notes'
        />
        <Form.Group inline>
          <Form.Input
            placeholder='28세'
            width={2}
          />
          ~
          <Form.Input
            placeholder='38세'
            width={2}
          />
          <Form.Input
          label='Location'
          placeholder='서울시 강남구'
          width={16}
        />
        </Form.Group>
        <Form.Input
          label='Keyword'
          placeholder='#python, #Django, #orm'
        />
        <Form.Button onClick={this._handleAppendSubmit}>등록</Form.Button>
      </Form>
    </Modal.Content>
  </Modal>
  )

  progressOptions = [
    // need api (post)
    {
      text: 'Alive',
      value: 'Alive'
    },
    {
      text: 'Holding',
      value: 'Holding'
    },
    {
      text: 'Done',
      value: 'Done'
    }
  ]

  _renderTable() {
    const { peopleData } = this.state

    return (
      <ReactTable
        data={peopleData}
        showPageSizeOptions={false}
        getTrProps={(state, rowInfo, column) => {
          return {
            style: {
              textAlign: 'center'
            },
            onClick: () => {
              this.setState({ clickedData: rowInfo.original, clicked: true })
            }
          }
        }}
        columns={[
          {
            columns: [
              {
                Header: 'Checkbox',
                accessor: 'Checkbox',
                Cell: <Checkbox />
              },
              {
                Header: '포지션 제목',
                accessor: 'name',
                Cell: props => (
                  <span onClick={this._openModal}>{props.value}</span>
                )
              },
              {
                Header: '포지션 회사',
                accessor: 'age',
                Cell: props => (
                  <span onClick={this._openModal}>{props.value}</span>
                )
              },
              {
                Header: '키워드',
                accessor: 'school',
                Cell: props => <span>{props.value}</span>
              },
              {
                Header: '등록일시',
                accessor: 'company',
                Cell: props => <span>{props.value}</span>
              },
              {
                Header: 'Status',
                accessor: 'career',
                Cell: props => <span>{props.value}</span>
              },
              {
                Header: 'Progress',
                accessor: 'career',
                Cell: props => <Dropdown options={this.progressOptions}/>
              }
            ]
          }
        ]}
        defaultPageSize={10}
        className="-striped -highlight"
      />
    )
  }

  async componentDidMount() {
    this.setState({
      loading: true
    })
    // need new API
    await Axios.post(API.mainTable, {
      under_age: 0,
      upper_age: 40,
      top_school: true,
      keyword: '인폼'
    })
      .then(res => {
        this.setState({
          peopleData: res.data.result,
          loading: false
        })
      })
      .catch(err => {
        console.log(err.response)
      })
  }

  Breadcrumb = () => (
    <Breadcrumb>
      <Breadcrumb.Section onClick={this._openEditModal}>편집</Breadcrumb.Section>
      <Breadcrumb.Divider />
      <Breadcrumb.Section onClick={this._openDeleteModal}>삭제</Breadcrumb.Section>
      <Breadcrumb.Divider />
      <Breadcrumb.Section onClick={this._openAppendModal}>등록</Breadcrumb.Section>
  </Breadcrumb>
  )

  MainPage = () => (
    <div>
      <Grid container stackable verticalAlign="middle">
        <Grid.Row>
          <Grid.Column width={16}>
            <Form>
              <Form.Group>
                <Form.Input
                  placeholder="검색어 (And, Or)"
                  width={4}
                  size="mini"
                />
                <Form.Button compact mini="true">
                  Search
                </Form.Button>
              </Form.Group>
            </Form>
          </Grid.Column>
        </Grid.Row>
        <br />
      </Grid>
    </div>
  )

  render() {
    const { loading } = this.state

    return loading ? (
      <Container>
        <this.MainPage />
        <br />
        <Spin />
      </Container>
    ) : (
      <Container>
        <this.MainPage />
        <br />
        <this.Breadcrumb />
        {this._renderTable()}
        <this.JobModalDelete />
        <this.JobModalAppend />
      </Container>
    )
  }
}
