import React, { Component } from 'react'
import Axios from 'axios'
import API from '../../util/api'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import {
  Container, Grid, Modal, 
  Divider, Checkbox, Table, Form, Dropdown, Button } from 'semantic-ui-react'

export default class People extends Component {
  state = {
    loading: false,
    peopleData: [],
    clickedData: [],
    mail: 
      `안녕하세요 ㅇㅇㅇ 님, 어제 제안드렸던 Position 에 대해서 어떻게 생각해보셨는지 문의차 다시 메일 드립니다. 간략히 검토후 의향에 대해서 회신 주시면 감사하겠습니다. ㅇㅇㅇ 드림`,
    sms: 
      `안녕하세요 ㅇㅇㅇ 님, 어제 제안드렸던 Position 에 대해서 어떻게 생각해보셨는지 문의차 다시 메일 드립니다. 간략히 검토후 의향에 대해서 회신 주시면 감사하겠습니다. ㅇㅇㅇ 드림`,

  }

  PeopleModal = () => (
    <Modal trigger={<Checkbox />}>
      <Modal.Header>{this.state.clickedData.name}</Modal.Header>
      <Modal.Content>
        <Grid padded>
          <Grid.Row>  
            <Grid.Column width={15}>
              [School]<br></br>{this.state.clickedData.school}
            </Grid.Column>
          </Grid.Row>
          <Divider />
          <Grid.Row>
            <Grid.Column width={15}>
              [Company]<br></br>{this.state.clickedData.company}
            </Grid.Column>
          </Grid.Row>
          <Divider />
          <Grid.Row>  
            <Grid.Column width={15}>
              [Others]<br></br>
            </Grid.Column>
          </Grid.Row>
          <Divider />
          <Grid.Row>
            <Grid.Column width={15}>
              [Position and Memo]<br></br><Table celled padded>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell singleLine>Position</Table.HeaderCell>
                    <Table.HeaderCell>Client</Table.HeaderCell>
                    <Table.HeaderCell>담당헤드헌터</Table.HeaderCell>
                    <Table.HeaderCell>일시</Table.HeaderCell>
                    <Table.HeaderCell>메모</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <Table.Row>
                    <Table.Cell singleLine>Java 개발자 과장급</Table.Cell>
                    <Table.Cell singleLine>Brandi</Table.Cell>
                    <Table.Cell singleLine>강상모</Table.Cell>
                    <Table.Cell singleLine>2018.12.30</Table.Cell>
                    <Table.Cell>
                      노트다 노트다 노트다 노트다 노트다 노트다 노트다 노트다 노트다 노트다 노트다 노트다
                      노트다 노트다 노트다 노트다 노트다 노트다 노트다 노트다 노트다 노트다 노트다 노트다
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell singleLine></Table.Cell>
                    <Table.Cell singleLine></Table.Cell>
                    <Table.Cell singleLine></Table.Cell>
                    <Table.Cell singleLine></Table.Cell>
                    <Table.Cell>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Content>
    </Modal>
  )

  MailModal = () => (
    <Modal trigger={<Button>Mail</Button>}>
      <Modal.Header>Mail: OOO</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.TextArea
            autoHeight
            value={this.state.mail}
            onChange={this._handleMailTextChange}
          />
          <Form.Button>Send</Form.Button>
        </Form>
      </Modal.Content>
    </Modal>
  )

  _handleMailTextChange = (event) => {
    this.setState({mail: event.target.value})
  }

  _handleMailSubmit = (event) => {
    // add mailgun api
    event.preventDefault()
  }

  SMSModal = () => (
    <Modal trigger={<Button>SMS</Button>}>
      <Modal.Header>SMS: </Modal.Header>
      <Modal.Content>
        <Form>
        <Form.TextArea
            autoHeight
            value={this.state.sms}
            onChange={this._handleSMSTextChange}
          />
          <Form.Button>Send</Form.Button>
        </Form>
      </Modal.Content>
    </Modal>
  )

  _handleSMSTextChange = (event) => {
    this.setState({sms: event.target.value})
  }

  _handleSMSSubmit = (event) => {
    // add SMS api
    event.preventDefault()
  }

  positionOptions = [ // need api (post)
    {
      text: 'Position 1',
      value: 'Position 1'
    },
    {
      text: 'Position 2',
      value: 'Position 2'
    }
  ]

  _renderTable() {
    const { peopleData } = this.state
    console.log('clicked', this.state.clickedData)
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
              this.setState({clickedData: rowInfo.original})
            }
          }
        }}
        columns={[
          {
            columns: [
              {
                Header: 'Checkbox',
                accessor: 'Checkbox',
                Cell: props => <this.PeopleModal />
              },
              {
                Header: '이름',
                accessor: 'name',
                Cell: props => <span>{props.value}</span>
              },
              {
                Header: '나이',
                accessor: 'rate', // 현재 나이 데이타가 없어서 임의로 rate
                Cell: props => <span>{props.value}</span>
              },
              {
                Header: '최종학력',
                accessor: 'school',
                Cell: props => <span>{props.value}</span>
                // Cell: props => <span>{props.value}</span>
              },
              {
                Header: '주요직장',
                accessor: 'company',
                Cell: props => <span>{props.value}</span>
              },
              {
                Header: '총 경력',
                accessor: 'career',
                Cell: props => <span>{props.value}</span>
              },
              {
                Header: '핵심 키워드',
                accessor: 'keyword',
                Cell: props => <span>{props.value}</span>
              },
              {
                Header: 'Resume Title',
                accessor: 'resume_title',
                Cell: props => <span>{props.value}</span>
              },
              {
                Header: '연봉',
                accessor: 'salary',
                Cell: props => <span>{props.value}</span>
              },
              {
                Header: 'Rate',
                accessor: 'rate',
                Cell: props => <span>{props.value}</span>
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
    await Axios.post(API.mainTable, {
      under_age: 0,
      upper_age: 70,
      top_school: true,
      keyword: 'python'
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

  render() {
    const { loading } = this.state

    return loading ? (
      <div>people loading</div>
    ) : (
      <Container>
        <Form>
          <Form.Group inline>
            <Form.Input placeholder='25세' width={2} />
            <Form.Input placeholder='35세' width={2} />
            <Form.Checkbox label='Top School' />
          </Form.Group>
          <Form.Group>
            <Form.Input placeholder='검색어 (And, Or)' width={4}/>
            <Form.Button>Search</Form.Button>
          </Form.Group>
          <br></br>
          <br></br>
        </Form>
        <Dropdown
          placeholder='Position' fluid selection
          options={this.positionOptions}
          style={{maxWidth:'20em'}}
          >
        </Dropdown>
        <Button.Group inline>
          <this.MailModal />
          <Button.Or />
          <this.SMSModal />
        </Button.Group>
        <br></br>
        {this._renderTable()}
      </Container>
    )
  }
}
