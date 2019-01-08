import React, { Component } from 'react';
import Axios from 'axios';
import API from '../../util/api';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
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
  Breadcrumb
} from 'semantic-ui-react';

export default class SMS extends Component {
  state = {
    loading: false,
    peopleData: [
      // 임시 데이터
      {
        name: 'Sangmo Kang',
        time: '2018.10.24 12:05:24',
        client: 'Samsung',
        position: 'BigData Enginner 채용',
        수신확인: 'receiving confirmed'
      }
    ],
    // peopleData: [],
    clickedData: [],
    mail: `안녕하세요 ㅇㅇㅇ 님, 어제 제안드렸던 Position 에 대해서 어떻게 생각해보셨는지 문의차 다시 메일 드립니다. 간략히 검토후 의향에 대해서 회신 주시면 감사하겠습니다. ㅇㅇㅇ 드림`
  };

  _renderTable() {
    const { peopleData } = this.state;

    console.log('clicked', this.state.clickedData);
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
              this.setState({ clickedData: rowInfo.original });
            }
          };
        }}
        columns={[
          {
            columns: [
              {
                Header: 'Checkbox',
                accessor: 'Checkbox',
                textAlign: 'center',
                maxWidth: 90,
                // Cell: props => <this.PeopleModal />
                Cell: props => <span>{props.value}</span>
              },
              {
                Header: '수신인',
                accessor: 'name',
                Cell: props => <span>{props.value}</span>
              },
              {
                Header: '발송시간',
                accessor: 'time',
                Cell: props => <span>{props.value}</span>
              },
              {
                Header: 'Client', // 요청한 회사
                accessor: 'client',
                Cell: props => <span>{props.value}</span>
                // Cell: props => <span>{props.value}</span>
              },
              {
                Header: 'Position',
                accessor: 'position',
                Cell: props => <span>{props.value}</span>
              },
              {
                Header: '발신내용',
                accessor: 'content',
                Cell: props => <span>{props.value}</span>
              }
            ]
          }
        ]}
        defaultPageSize={15}
        className="-striped -highlight"
      />
    );
  }

  async componentDidMount() {
    this.setState({
      loading: true
    });
    await Axios.post(API.mainTable, {
      // 제대로 된 API 주소 나오면 변경해야 함.
      under_age: 0,
      upper_age: 70,
      top_school: true,
      keyword: 'python'
    })
      .then(res => {
        this.setState({
          // peopleData: res.data.result,
          loading: false
        });
      })
      .catch(err => {
        console.log(err.response);
      });
  }
  render() {
    const { loading } = this.state;

    return loading ? (
      <div>people loading</div>
    ) : (
      <Container>
        <Grid.Row>
          <Grid.Column width={13}>
            <Breadcrumb>
              {/* mail/sms 이동하는 별도의 메뉴 */}
              <Breadcrumb.Section link active>
                Mail
              </Breadcrumb.Section>
              <Breadcrumb.Divider>|</Breadcrumb.Divider>
              <Breadcrumb.Section link>SMS</Breadcrumb.Section>
              <Breadcrumb.Divider>|</Breadcrumb.Divider>
            </Breadcrumb>
          </Grid.Column>
          <Grid.Column width={3}>
            <Breadcrumb>
              <Breadcrumb.Section link>Follow up</Breadcrumb.Section>
              <Breadcrumb.Divider>|</Breadcrumb.Divider>
              <Breadcrumb.Section>
                <a href="/">새로운 문자</a>
              </Breadcrumb.Section>
            </Breadcrumb>
          </Grid.Column>
        </Grid.Row>

        <br />
        <br />
        {this._renderTable()}
      </Container>
    );
  }
}
