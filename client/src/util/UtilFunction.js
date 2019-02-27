import Axios from 'axios'
import API from '../util/api'

export const koreanAgetoYear = koreanAge => {
  let today = new Date()
  let birthYears = today.getFullYear() + 1 - Number(koreanAge)
  return Number(birthYears)
}

export const sendSMS = async (
  thisStateSms,
  thisStateSelectedRowKeys,
  thisStateSelectedRows,
  thisPropsUserId
) => {
  await console.log('1state', thisStateSms)
  await console.log('1selected rowskeys: ', thisStateSelectedRowKeys)
  await console.log('1selected rows: ', thisStateSelectedRows)
  await console.log('1thisPropsUserId: ', thisPropsUserId)
  await console.log('1preparing to send')
  if (thisStateSelectedRowKeys.length === 0) {
    try {
      await Axios.post(API.sendSMS, {
        user_id: thisPropsUserId,
        rm_code: '',
        recipient: thisStateSms.receiver,
        body: thisStateSms.content,
        position: ''
      })
      await console.log(`${thisStateSms.receiver}에 문자를 보냈습니다.`)
      // await this.resetSelections()
    } catch (err) {
      console.log('send one SMS error', err)
    }
  }

  if (thisStateSelectedRowKeys.length === 1) {
    try {
      await Axios.post(API.sendSMS, {
        user_id: thisPropsUserId,
        rm_code: thisStateSelectedRowKeys[0],
        recipient: thisStateSelectedRows[0].mobile,
        body: thisStateSms.content,
        position: `${thisStateSms.positionCompany}|${thisStateSms.select}`
      })
      await console.log(
        `${thisStateSelectedRows[0].mobile}에 문자를 보냈습니다.`
      )
      // await this.resetSelections()
    } catch (err) {
      console.log('send one SMS error', err)
    }
  } else {
    try {
      for (let i = 0; i < thisStateSelectedRowKeys.length; i++) {
        await setTimeout(() => {
          Axios.post(API.sendSMS, {
            user_id: thisPropsUserId,
            rm_code: thisStateSelectedRowKeys[i],
            recipient: thisStateSelectedRows[i].mobile,
            body: thisStateSms.content,
            position: `${thisStateSms.positionCompany}|${thisStateSms.select}`
          })
        }, 100)
      }
      await alert(`문자를 보냈습니다.`)
      // await this.resetSelections()
    } catch (err) {
      console.log('sending multiple SMS error', err)
    }
  }
}
