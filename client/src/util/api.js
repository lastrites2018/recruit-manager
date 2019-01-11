const BASE_URL = 'http://128.199.203.161:8000';

export default {
  crawling: `${BASE_URL}/resume/crawling`,
  loginValidation: `${BASE_URL}/resume/login`,
  mainTable: `${BASE_URL}/resume/view_main_table`,
  sendMail: `${BASE_URL}/resume/mail_send`,
  sendSMS: `${BASE_URL}/resume/sms_send`,
  viewMemo: `${BASE_URL}/resume/view_memo`,
  writeMemo: `${BASE_URL}/resume/memo_write`,
  updateMemo: `${BASE_URL}/resume/memo_update`,
  deleteMemo: `${BASE_URL}/resume/memo_delete`
};
