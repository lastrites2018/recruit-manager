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
      // await alert(`${thisStateSms.receiver}에 문자를 보냈습니다.`)
      await console.log(`${thisStateSms.receiver}에 문자를 보냈습니다.`)
    } catch (err) {
      console.log('send one SMS error', err)
    }
  }

  if (thisStateSelectedRowKeys.length === 1) {
    try {
      await Axios.post(API.sendSMS, {
        user_id: thisPropsUserId,
        rm_code: thisStateSelectedRowKeys[0],
        recipient: thisStateSms.receiver,
        // recipient: thisStateSelectedRows[0].mobile,
        body: thisStateSms.content,
        position: `${thisStateSms.positionCompany}|${thisStateSms.select}`
      })
      // await alert(`${thisStateSms.receiver}에 문자를 보냈습니다.`)
      await console.log(
        `${thisStateSms.receiver}에 문자를 보냈습니다.`
        // `${thisStateSelectedRows[0].mobile}에 문자를 보냈습니다.`
      )
    } catch (err) {
      console.log('send one SMS error', err)
    }
  } else {
    try {
      const receivers = thisStateSms.receiver.split(',')
      for (let i = 0; i < receivers.length; i++) {
        // for (let i = 0; i < thisStateSelectedRowKeys.length; i++) { // 보내는 번호가 바뀌었을 수 있기에, 입력값을 기준으로 보냄
        await setTimeout(() => {
          Axios.post(API.sendSMS, {
            user_id: thisPropsUserId,
            rm_code: thisStateSelectedRowKeys[i],
            recipient: receivers[i],
            // recipient: thisStateSelectedRows[i].mobile,
            body: thisStateSms.content,
            position: `${thisStateSms.positionCompany}|${thisStateSms.select}`
          })
        }, 100)
      }
      await alert(`문자를 ${receivers.join(' 님, ')} 님에게 보냈습니다.`)
    } catch (err) {
      console.log('sending multiple SMS error', err)
    }
  }
}
