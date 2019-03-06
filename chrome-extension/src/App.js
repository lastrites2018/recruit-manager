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
      resumeCount: 0,
      mailCount: 0,
      smsCount: 0,
      history: '',
      candidate: {},
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
      fetchingUserData: false,
      validated: false,
      isLoggedIn: false,
      user: {}
    };
  }

  componentDidMount() {
    this.checkStorage();
    this.fetchCandidate();
    this.fetchPosition();
    this.getResumeCount();
    this.getCount('mailCount');
    this.getCount('smsCount');
  }

  checkStorage = async () => {
    await chrome.storage.local.get(['user'], result => {
      if (result.user && result.user.check === true) {
        this.setState({
          isLoggedIn: true,
          user: result.user
        });
      }
    });
  };

  fetchCandidate = async () => {
    const storage = chrome.storage.local;
    await storage.get('candidate', response => {
      this.setState({ candidate: response.candidate.result });
    });
  };

  fetchPosition = async () => {
    const positions = await Axios.post(Api.getPosition, {
      user_id: this.state.user.user_email
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
        user_id: this.state.user.user_email,
        rm_code: this.state.candidate.rm_code,
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
      user_id: this.state.user.user_email,
      rm_code: this.state.candidate.rm_code
    });
    this.setState({ memo: memo.data.result });
    return memo;
  };

  mailSubmit = event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      this.setState({ validated: true });
      this.sendMail();
    }
  };

  fetchMail = () => {
    Axios.post(Api.getMail, {
      user_id: this.state.user.user_id,
      rm_code: this.state.candidate.rm_code
    });
  };

  sendMail = () => {
    // Axios.post(Api.sendMail, {
    //   user_id: this.state.user.user_email,
    //   rm_code: this.state.candidate.rm_code,
    //   sender: this.state.user.user_email,
    //   recipient: this.state.candidate.email,
    //   subject: this.state.mail.title,
    //   body:
    //     this.state.mail.content +
    //     '\n\n' +
    //     '[Position Detail]\n\n' +
    //     this.state.positionDetail +
    //     '\n\n' +
    //     this.state.mail.sign,
    //   position: this.state.selectedPosition
    // });
    this.addCount('mailCount');
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
      this.setState({ validated: true });
      this.sendSMS();
    }
  };

  sendSMS = () => {
    // Axios.post(Api.sendSMS, {
    //   user_id: this.state.user.user_email,
    //   rm_code: this.state.candidate.rm_code,
    //   recipient: this.candidate.mobile,
    //   body: this.state.sms.content,
    //   position: this.state.selectedPosition
    // });
    // console.log('sms has been sent');
    this.addCount('smsCount');
  };

  getResumeCount = () => {
    const storage = chrome.storage.local;
    storage.get('resumeCount', result => {
      if (!result.resumeCount) storage.set({ resumeCount: 1 });
      else this.setState({ resumeCount: result.resumeCount + 1 });
    });
  };

  getCount = key => {
    const storage = chrome.storage.local;
    storage.get(key, result => {
      const currCount = result[key];
      this.setState({ [key]: currCount });
    });
  };

  addCount = key => {
    chrome.storage.local.get(key, async result => {
      if (result[key]) {
        const currCount = result[key];
        await chrome.storage.local.set({ [key]: currCount + 1 }, () => {
          this.setState({ [key]: currCount + 1 });
        });
      } else {
        await chrome.storage.local.set({ [key]: 1 }, () => {
          this.setState({ [key]: 1 });
        });
      }
    });
  };

  getHistory = async () => {
    const history = await Axios.post(Api.blablabla, {
      // waiting
      user_id: this.state.user.user_email
    });
    this.setState({ history });
  };

  logout = () => {
    chrome.storage.local.clear();
    chrome.storage.local.set({ resumeCount: 0, mailCount: 0, smsCount: 0 });
    this.setState({
      isLoggedIn: false,
      resumeCount: 0,
      mailCount: 0,
      smsCount: 0
    });
  };

  requestUserIdentity = () => {
    this.setState({ fetchingUserData: true });
    var port = chrome.extension.connect({
      name: 'User Email Communication'
    });
    port.postMessage('Requesting user email address');
    port.onMessage.addListener(result => {
      if (result.user && result.user.check === true) {
        chrome.storage.local.set({ resumeCount: 1 });
        this.setState({
          user: result.user,
          isLoggedIn: true,
          fetchingUserData: false,
          resumeCount: 1
        });
      } else {
        alert('Unauthorized email address');
        this.setState({ fetchingUserData: false });
      }
    });
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
      validated,
      user
    } = this.state;

    return (
      <Container>
        {this.state.isLoggedIn === false ? (
          this.state.fetchingUserData === false ? (
            <div>
              <h2 className="text-center">Unauthorized user</h2>
              <br />
              <Button block onClick={this.requestUserIdentity}>
                <i class="fas fa-sign-in-alt"> 로그인</i>
              </Button>
            </div>
          ) : (
            <div>
              <h2 className="text-center">Unauthorized user</h2>
              <br />
              <Button block disabled>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
              </Button>
            </div>
          )
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
              <Col className="text-right">{user.user_email}</Col>
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
                          value={candidate.email}
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
                          value={candidate.mobile}
                          onChange={event =>
                            this.setState({
                              candidate: {
                                ...candidate,
                                mobile: event.target.value
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
