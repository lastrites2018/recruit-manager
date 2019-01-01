import React, { Component } from 'react';
import Axios from 'axios';
import API from '../../util/api';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Container, Grid } from 'semantic-ui-react';

export default class People extends Component {
  state = {
    loading: false,
    peopleData: []
  };

  _renderTable() {
    const { peopleData } = this.state;
    return (
      <ReactTable
        data={peopleData}
        showPageSizeOptions={false}
        getTrProps={(state, rowInfo, column) => {
          return {
            style: {
              textAlign: 'center'
            }
          };
        }}
        columns={[
          {
            columns: [
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
    );
  }

  async componentDidMount() {
    this.setState({
      loading: true
    });
    await Axios.post(API.mainTable, {
      under_age: 0,
      upper_age: 70,
      top_school: true,
      keyword: 'python'
    })
      .then(res => {
        console.log(res);
        this.setState({
          peopleData: res.data.result,
          loading: false
        });
      })
      .catch(err => {
        console.log(err.response);
      });
  }

  render() {
    const { loading } = this.state;

    console.log(this.state.peopleData);
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
    );
  }
}
