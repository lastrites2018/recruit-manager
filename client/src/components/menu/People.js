import React, { Component } from 'react'
import Axios from 'axios'
import API from '../../util/api'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import {
  Container, Grid, Modal, 
  Divider, Checkbox, Table, Header, Rating } from 'semantic-ui-react'

export default class People extends Component {
  state = {
    loading: false,
    peopleData: [],
    clickedPerson: null,
    clickedSchool: null,
    clickedCompany: null

  }

  PeopleModal = () => (
    <Modal trigger={<Checkbox />}>
      <Modal.Header>{this.state.clickedPerson}</Modal.Header>
      <Modal.Content>
        <Grid padded>
          <Grid.Row>  
            <Grid.Column width={15}>
              [School]<br></br>{this.state.clickedSchool}
            </Grid.Column>
          </Grid.Row>
          <Divider />
          <Grid.Row>
            <Grid.Column width={15}>
              [Company]<br></br>{this.state.clickedCompany}
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

  _renderTable() {
    const { peopleData } = this.state
    console.log('clicked', this.state.clickedPerson)
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
              this.setState({clickedPerson: rowInfo.original.name})
              this.setState({clickedSchool: rowInfo.original.school})
              this.setState({clickedCompany: rowInfo.original.company})
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
    // console.log(this.state.peopleData)

    return loading ? (
      <div>people loading</div>
    ) : (
      <Container>
        <Grid>
          <Grid.Row>
            <Grid.Column width={15}>
              나이 검색바 ㅁ ~ ㅁ 체크박스 [탑스쿨] 검색창 [서치 버튼]
              [포지션][메일][SMS] 편집|삭제|등록
              {this._renderTable()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
}
