import React, { Component } from 'react'
import Axios from 'axios'
import API from '../../util/api'
import Loader from '../../util/Loader'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import './menu.css'
import {
  Container,
  Grid,
  Modal,
  Divider,
  Checkbox,
  Table,
  Form,
  Dropdown,
  Button,
  Label
} from 'semantic-ui-react'

export default class People extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      peopleData: [],
      clicked: false,
      clickedData: [],
      isOpen: false,
      mailText: '',
      mailSubject: '',
      phoneNumber: '',
      SMSText: '',
      inValidPhoneNumber: true
    }
  }

  _openModal = () => this.setState({ isOpen: true })
  _closeModal = () => this.setState({ isOpen: !this.state.isOpen })

  PeopleModal = () => (
    <Modal
      open={this.state.isOpen}
      onClose={this._closeModal}
      closeOnDimmerClick={false}
    >
      <Modal.Header>{this.state.clickedData.name}</Modal.Header>
      <Modal.Content>
        <Grid padded>
          <Grid.Row>
            <Grid.Column width={15}>
              [School]
              <br />
              {this.state.clickedData.school}
            </Grid.Column>
          </Grid.Row>
          <Divider />
          <Grid.Row>
            <Grid.Column width={15}>
              [Company]
              <br />
              {this.state.clickedData.company}
            </Grid.Column>
          </Grid.Row>
          <Divider />
          <Grid.Row>
            <Grid.Column width={15}>
              [Others]
              <br />
            </Grid.Column>
          </Grid.Row>
          <Divider />
          <Grid.Row>
            <Grid.Column width={15}>
              [Position and Memo]
              <br />
              <Table celled padded>
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
                      노트다 노트다 노트다 노트다 노트다 노트다 노트다 노트다
                      노트다 노트다 노트다 노트다 노트다 노트다 노트다 노트다
                      노트다 노트다 노트다 노트다 노트다 노트다 노트다 노트다
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell singleLine />
                    <Table.Cell singleLine />
                    <Table.Cell singleLine />
                    <Table.Cell singleLine />
                    <Table.Cell />
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={this._closeModal}
          color="teal"
          icon="checkmark"
          content="Close"
        />
      </Modal.Actions>
    </Modal>
  )

  MailModal = () => (
    <Modal trigger={<Button>Mail</Button>}>
      <Form onSubmit={this._handleMailSubmit}>
        <Modal.Header>
          <br />
          <Form.Group inline>
            <Form.Input
              // fluid
              mini
              id="form-subcomponent-shorthand-input-first-name"
              label="Mail:"
              name="mailSubject"
              placeholder="Mail Subject"
              onChange={this._handleChange}
              style={{ minWidth: '20em', maxWidth: '65em' }}
            />
            <Form.Field>
              <label>수신인 : {this.state.clickedData.name}</label>
            </Form.Field>
          </Form.Group>
        </Modal.Header>
        {/* <Modal.Header>Mail: {this.state.clickedData.name}</Modal.Header> */}
        <Modal.Content>
          <Form.Input
            name="mailText"
            required
            control="textarea"
            onChange={this._handleChange}
            defaultValue={`안녕하세요 ${
              this.state.clickedData.name
            } 님, 어제 제안드렸던 Position 에 대해서 어떻게 생각해보셨는지 문의차 다시 메일 드립니다. 간략히 검토후 의향에 대해서 회신 주시면 감사하겠습니다. 강상모 드림`}
            type="text"
          />
          <Form.Button type="submit">Send</Form.Button>
        </Modal.Content>
      </Form>
    </Modal>
  )

  _handleChange = e => {
    console.log('etn', e.target.name)
    console.log('etv', e.target.value)
    this.setState({ [e.target.name]: e.target.value })
  }

  _handleMailSubmit = event => {
    // add mailgun api
    event.preventDefault()
    const { mailText, mailSubject } = this.state
    this.setState({
      loading: true
    })
    console.log('mailcontent!', this.state)
    Axios.post(API.sendMail, {
      user_id: 'rmrm',
      rm_id: 'linkedin_1',
      sender: 'sender@gmail.com',
      recipent: 'jaewankim@codestates.com',
      // recipent: 'krama9181@gmail.com',
      subject: mailSubject,
      body: mailText,
      position: 'KT|자연어처리'
    })
      .then(res => {
        console.log('mailsend?', res) //현재 메일 보내면 400 error, postman 테스트 해보기
        this.setState({
          loading: false,
          mailSubject: '',
          mailText: ''
        })
      })
      .catch(err => {
        console.log(err.response)
      })
  }

  SMSModal = () => (
    <Modal trigger={<Button>SMS</Button>}>
      <Form onSubmit={this._handleSMSSubmit}>
        <Modal.Header>
          <br />
          <Form.Group inline>
            <Form.Input
              // fluid
              mini
              id="form-subcomponent-shorthand-input-first-name"
              label="SMS:"
              name="phoneNumber"
              placeholder="phone number"
              onChange={e => {
                this.setState({ [e.target.name]: e.target.value })
                this._validatePhoneNumber(e.target.value)
              }}
              // onChange={this._handleChange this._validatePhoneNumber}
              // onChange={this._handleChange}
              style={{ minWidth: '20em', maxWidth: '35em' }}
            />
            {this.state.inValidPhoneNumber ? null : this._alertInvalidString()}
            <Form.Field>
              <label>수신인 : {this.state.clickedData.name}</label>
            </Form.Field>
          </Form.Group>
        </Modal.Header>
        <Modal.Content>
          <Form.Input
            name="SMSText"
            required
            control="textarea"
            onChange={this._handleChange}
            defaultValue={`안녕하세요 ${
              this.state.clickedData.name
            } 님, 어제 제안드렸던 Position 에 대해서 어떻게 생각해보셨는지 문의차 다시 메일 드립니다. 간략히 검토후 의향에 대해서 회신 주시면 감사하겠습니다. 강상모 드림`}
            type="text"
          />
          <Form.Button>Send</Form.Button>
        </Modal.Content>
      </Form>
    </Modal>
  )

  _handleSMSSubmit = event => {
    event.preventDefault()
    const { phoneNumber, SMSText } = this.state
    this.setState({
      loading: true
    })
    console.log('SMSContent!', this.state)
    Axios.post(API.sendSMS, {
      user_id: 'rmrm',
      recipent: phoneNumber,
      body: SMSText
    })
      .then(res => {
        console.log('SMSsend?', res)
        this.setState({
          loading: false,
          phoneNumber: '',
          SMSText: ''
        })
      })
      .catch(err => {
        console.log('SMSERR', err)
      })
  }

  _validatePhoneNumber(phonenumber) {
    const isValidNumber = /^(?:(010-?\d{4})|(01[1|6|7|8|9]-?\d{3,4}))-?\d{4}$/.test(
      phonenumber
    )
    const onlyNumber = phonenumber.split('-').join('')

    if (isValidNumber) {
      this.setState({ inValidPhoneNumber: true, phoneNumber: onlyNumber })
      return true
    } else {
      this.setState({ inValidPhoneNumber: false })
      return false
    }
  }
  _alertInvalidString() {
    if (!this.state.inValidPhoneNumber) {
      return (
        <Label basic size="large" color="red" pointing="left">
          숫자 번호를 끝까지 입력해주세요!
        </Label>
      )
    }
  }

  positionOptions = [
    // need api (post)
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
                Header: '이름',
                accessor: 'name',
                Cell: props => (
                  <span onClick={this._openModal}>{props.value}</span>
                )
              },
              {
                Header: '나이',
                accessor: 'age',
                Cell: props => (
                  <span onClick={this._openModal}>{props.value}</span>
                )
              },
              {
                Header: '최종학력',
                accessor: 'school',
                Cell: props => <span>{props.value}</span>
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
      // under_age: 0,
      // upper_age: 70,
      // top_school: true,
      // keyword: 'python'
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

  MainPage = () => (
    <div>
      <Grid container stackable verticalAlign="middle">
        <Grid.Row>
          <Grid.Column width={16}>
            <Form>
              <Form.Group inline>
                <Form.Input placeholder="25세" width={2} />
                <Form.Input placeholder="35세" width={2} />
                <Form.Checkbox label="Top School" />
              </Form.Group>
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
        <Grid.Row>
          <Grid.Column width={4}>
            <Dropdown
              placeholder="Position"
              fluid
              multiple
              selection
              options={this.positionOptions}
              style={{ minWidth: '10em', maxWidth: '25em' }}
            />
          </Grid.Column>
          <Grid.Column width={3}>
            <Button.Group inline compact mini="true">
              <this.MailModal />
              <Button.Or />
              <this.SMSModal />
            </Button.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )

  render() {
    const { loading } = this.state
    console.log(this.state)

    return loading ? (
      <Container>
        <this.MainPage />
        <br />
        <Loader />
      </Container>
    ) : (
      <Container>
        <this.MainPage />
        <br />
        {this._renderTable()}
        <this.PeopleModal />
      </Container>
    )
  }
}
