/*global chrome*/
import React, { Component } from 'react';
import { Button, Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import Axios from 'axios';
import Api from './utils/api';

class App extends Component {
  constructor(props) {
    super(props);
    chrome.runtime.sendMessage({ action: 'popupOpen' });

    this.state = {
      resumeCount: 100,
      mailCount: 100,
      smsCount: 100,
      candidate: { rm_code: '', email: '', cell: '' },
      positions: [],
      selectedPosition: null,
      positionDetail: '',
      memo: [],
      newNote: '',
      mail: {
        title: '',
        content:
          '안녕하세요, \n간략히 검토후 의향에 대해서 회신 주시면 감사하겠습니다.',
        sign: `\n커리어셀파 헤드헌터 강상모 \n+82 010 3929 7682 \nwww.careersherpa.co.kr`
      },
      sms: {
        content: `안녕하세요 ${
          this.selectedPosition
        }으로 제안드리오니 메일 검토를 부탁드리겠습니다. 감사합니다.`,
        sign: '\n커리어셀파 강상모 드림. 010-3929-7682'
      },
      validated: false,
      userEmail: null,
      isLoggedIn: false
    };
  }

  componentDidMount() {
    this.checkStorage();
    this.fetchPosition();
  }

  fetchPosition = async () => {
    const positions = await Axios.post(Api.getPosition, {
      user_id: 'rmrm'
    });
    this.setState({ positions });
    return positions;
  };

  fetchPositionDetail = () => {
    const selectedPosition = this.state.selectedPosition;
    const positions = this.state.positions.data.result;
    for (let i = 0; i < positions.length; i++) {
      if (positions[i].title.includes(selectedPosition)) {
        this.setState({ positionDetail: positions[i].detail });
        break;
      }
    }
    this.updateSmsContent();
  };

  memoSubmit = event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    event.preventDefault();
    this.setState({ validated: true });
    this.writeMemo(this.state.newNote, this.state.selectedPosition);
  };

  writeMemo = async (body, position) => {
    try {
      const memo = await Axios.post(Api.writeMemo, {
        user_id: 'rmrm',
        rm_code: 'resume_3',
        position: position,
        body: body,
        client: 'll'
      });
      await this.viewMemo();
      return memo;
    } catch (err) {
      console.log(err);
    }
  };

  viewMemo = async () => {
    const memo = await Axios.post(Api.getMemo, {
      user_id: 'rmrm',
      rm_code: 'resume_3' // 수정 필요
    });
    this.setState({ memo: memo.data.result });
    return memo;
  };

  mailSubmit = event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    event.preventDefault();
    this.setState({ validated: true, mailCount: this.state.mailCount + 1 });
    // this.sendMail();
  };

  sendMail = () => {
    Axios.post(Api.sendMail, {
      user_id: 'rmrm',
      rm_code: 'resume_3', // 수정 필요
      sender: this.state.userEmail,
      recipient: this.state.candidate.email,
      subject: this.state.mail.title,
      body:
        this.state.mail.content +
        '\n\n' +
        '[Position Detail]\n\n' +
        this.state.positionDetail +
        '\n\n' +
        this.state.mail.sign,
      position: this.state.selectedPosition
    });
    console.log('mail has been sent');
  };

  updateSmsContent = () => {
    console.log('sms content');
    this.setState({
      sms: {
        ...this.sms,
        content: `안녕하세요 ${
          this.state.selectedPosition
        }으로 제안드리오니 메일 검토를 부탁드리겠습니다. 감사합니다.`,
        sign: '\n커리어셀파 강상모 드림. 010-3929-7682'
      }
    });
  };

  smsSubmit = event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      this.setState({ validated: true, smsCount: this.state.smsCount + 1 });
      // this.sendSMS();
    }
  };

  sendSMS = () => {
    Axios.post(Api.sendSMS, {
      user_id: 'rmrm',
      rm_code: 'resume_3', // 수정 필요
      recipient: this.candidate.cell,
      body: this.state.sms.content,
      position: this.state.selectedPosition
    });
    console.log('sms has been sent');
  };

  checkStorage = () => {
    chrome.storage.local.get(['userEmail'], result => {
      // add more email addresses below
      if (result.userEmail && result.userEmail === 'sungunkim367@gmail.com') {
        this.setState({ isLoggedIn: true, userEmail: result.userEmail });
      } else {
        alert('unauthorized email address!');
      }
    });
  };

  requestUserIdentity = () => {
    var port = chrome.extension.connect({
      name: 'User Email Communication'
    });
    port.postMessage('Requesting user email address');
    port.onMessage.addListener(userEmail => {
      // add more email addresses below
      if (userEmail === 'sungunkim367@gmail.com') {
        this.setState({ userEmail, isLoggedIn: true });
      } else {
        alert('unauthorized email address!');
      }
    });
  };

  /* timer */
  // sleep(ms) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }

  logout = () => {
    chrome.storage.local.clear();
    this.setState({ isLoggedIn: false });
  };

  render() {
    const {
      resumeCount,
      mailCount,
      smsCount,
      candidate,
      positions,
      positionDetail,
      selectedPosition,
      memo,
      mail,
      sms,
      validated
    } = this.state;
    console.log(this.state);

    return (
      <Container>
        {this.state.isLoggedIn === false ? (
          <div>
            <h2 className="text-center">Unauthorized user</h2>
            <br />
            <Button block onClick={this.requestUserIdentity}>
              <i class="fas fa-sign-in-alt"> 로그인</i>
            </Button>
          </div>
        ) : (
          <div>
            <Button style={{ float: 'right' }} size="sm" onClick={this.logout}>
              로그아웃
            </Button>
            <h2 className="text-center">Recruit Manager</h2>
            <br />
            <Row>
              <Col>Resume: {resumeCount}</Col>
              <Col />
              <Col className="text-right">Sangmo Kang</Col>
            </Row>
            <Row>
              <Col>Mail: {mailCount}</Col>
              <Col />
              <Col className="text-right">Careersherpa</Col>
            </Row>
            <Row>
              <Col>SMS: {smsCount}</Col>
              <Col />
              <Col className="text-right">{this.state.userEmail}</Col>
            </Row>
            <hr />
            <Row>
              <Col>[History]</Col>
            </Row>
            <Row>
              <Col>Viewed By Sangmo Kang</Col>
            </Row>
            <hr />
            <Row />
            <Row>
              <Col>
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={e => this.memoSubmit(e)}
                >
                  <Form.Row>
                    <Form.Group as={Col} controlId="selectedPosition">
                      <Form.Control
                        as="select"
                        size="sm"
                        required
                        onChange={event =>
                          this.setState(
                            {
                              selectedPosition: event.target.value,
                              mail: {
                                ...mail,
                                title: event.target.value
                              }
                            },
                            () => this.fetchPositionDetail()
                          )
                        }
                      >
                        <option>Position List</option>
                        {positions && positions.data
                          ? positions.data.result.map(position => {
                              return (
                                <option as="button" size="sm">
                                  {position.title}
                                </option>
                              );
                            })
                          : null}
                      </Form.Control>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} controlId="validationMemo">
                      <Form.Control
                        type="text"
                        size="sm"
                        placeholder="메모"
                        required
                        onChange={event =>
                          this.setState({ newNote: event.target.value })
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        메모를 작성해주세요.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Button type="submit" block size="sm">
                      입력
                    </Button>
                  </Form.Row>
                </Form>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col>
                <ListGroup flush>
                  {memo && memo.length ? (
                    memo.map(line => {
                      return (
                        <ListGroup.Item
                          variant="light"
                          className="p-1"
                          style={{ fontSize: 14 }}
                        >
                          {line.note}
                        </ListGroup.Item>
                      );
                    })
                  ) : (
                    <ListGroup.Item
                      action
                      variant="light"
                      className="p-1"
                      style={{ fontSize: 14 }}
                    >
                      메모가 없습니다
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col>
                <details>
                  <summary>[Mail]</summary>
                  <br />
                  <Form
                    noValidate
                    validated={validated}
                    onSubmit={e => this.mailSubmit(e)}
                  >
                    <Form.Group as={Row} controlId="emailRecipient">
                      <Form.Label column sm={2}>
                        수신인
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          plaintext
                          value="sungunkim367@gmail.com"
                          onChange={event =>
                            this.setState({
                              candidate: {
                                ...candidate,
                                email: event.target.value
                              }
                            })
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          이메일을 입력해주세요.
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="mailTitle">
                      <Form.Label column sm={2}>
                        제목
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          type="text"
                          size="sm"
                          required
                          plaintext
                          value={selectedPosition}
                          onChange={event =>
                            this.setState({
                              mail: {
                                ...mail,
                                title: event.target.value
                              }
                            })
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          메일 제목을 작성해주세요.
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="mailContent">
                      <Form.Label column sm={2}>
                        내용
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          as="textarea"
                          size="sm"
                          rows="2"
                          required
                          value={mail.content}
                          onChange={event =>
                            this.setState({
                              mail: {
                                ...mail,
                                content: event.target.value
                              }
                            })
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          메일을 작성해주세요.
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Col sm={9} />
                      <Button column sm={2} size="sm" variant="outline-warning">
                        <i className="fas fa-arrow-left" />
                      </Button>
                      <Col sm={2}>
                        <Button
                          column
                          sm={2}
                          size="sm"
                          variant="outline-warning"
                        >
                          <i className="fas fa-arrow-right" />
                        </Button>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="mailPositionDetail">
                      <Form.Label column sm={2}>
                        상세정보
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          as="textarea"
                          size="sm"
                          rows="3"
                          required
                          value={positionDetail}
                          onChange={event =>
                            this.setState({
                              positionDetail: event.target.value
                            })
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          포지션 디테일을 작성해주세요.
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                    <Button type="submit" block size="sm">
                      <i class="fas fa-envelope"> 메일 보내기</i>
                    </Button>
                  </Form>
                </details>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col>
                <details>
                  <summary>[SMS]</summary>
                  <br />
                  <Form
                    noValidate
                    validated={validated}
                    onSubmit={e => this.smsSubmit(e)}
                  >
                    <Form.Group as={Row} controlId="smsRecipient">
                      <Form.Label column sm={2}>
                        수신인
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          plaintext
                          size="sm"
                          value="01012345678"
                          onChange={event =>
                            this.setState({
                              candidate: {
                                ...candidate,
                                cell: event.target.value
                              }
                            })
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          전화번호를 입력해주세요.
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="smsContent">
                      <Form.Label column sm={2}>
                        내용
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          as="textarea"
                          size="sm"
                          rows="2"
                          required
                          value={sms.content}
                          onChange={event =>
                            this.setState({
                              sms: {
                                ...sms,
                                content: event.target.value
                              }
                            })
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          문자를 입력해주세요.
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                      <Col sm={9} />
                      <Button column sm={2} size="sm" variant="outline-warning">
                        <i className="fas fa-arrow-left" />
                      </Button>
                      <Col sm={2}>
                        <Button
                          column
                          sm={2}
                          size="sm"
                          variant="outline-warning"
                        >
                          <i className="fas fa-arrow-right" />
                        </Button>
                      </Col>
                    </Form.Group>
                    <Button type="submit" block size="sm">
                      <i class="fas fa-comment"> 문자 보내기</i>
                    </Button>
                  </Form>
                </details>
              </Col>
            </Row>
          </div>
        )}
      </Container>
    );
  }
}

export default App;
