const BASE_URL = 'http://128.199.203.161:8000'

export default {
  crawling: `${BASE_URL}/resume/crawling`,
  loginValidation: `${BASE_URL}/resume/login`,
  mainTable: `${BASE_URL}/resume/view_main_table`,
  viewMainTablePosition: `${BASE_URL}/resume/view_main_table_position`,
  rmDetail: `${BASE_URL}/resume/rm_detail`,
  getMail: `${BASE_URL}/resume/view_mail_table`,
  sendMail: `${BASE_URL}/resume/mail_send`,
  getSMS: `${BASE_URL}/resume/view_sms_table`,
  sendSMS: `${BASE_URL}/resume/sms_send`,
  getMemo: `${BASE_URL}/resume/view_memo`,
  writeMemo: `${BASE_URL}/resume/memo_write`,
  updateMemo: `${BASE_URL}/resume/memo_update`,
  deleteMemo: `${BASE_URL}/resume/memo_delete`,
  getPosition: `${BASE_URL}/resume/view_position_table`,
  insertPosition: `${BASE_URL}/resume/position_insert`,
  updatePosition: `${BASE_URL}/resume/position_update`,
  deletePosition: `${BASE_URL}/resume/position_delete`
}
