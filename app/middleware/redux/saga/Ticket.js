import { call, put } from 'redux-saga/effects'

import * as actions from '../actions/Ticket'
import api from '../../api'


export function * updateTicketSaga(action) {
    yield put(actions.isUpdating())
    try {
        if(action.payload.action){
          console.log(action.payload.ticket.id)
          console.log(action.payload.action)
          switch(action.payload.action){
            case 'agree':
              console.log('agree saga')
              const agreeResponse = yield call(api.agreeTicket, action.payload.comment, action.payload.ticket.id)
              break;

            case 'disagree':
              console.log('disagree saga')
              const disagreeResponse = yield call(api.disagreeTicket, action.payload.comment, action.payload.ticket.id)
              break;
          }
        }else{
          const updateResponse = yield call(api.updateTicketStatus, action.payload.ticket)
        }
        yield put(actions.updated())
    }
    catch(error) {
        yield put(actions.updateFailed(error))
    }
}

export function * addTicketSaga(action) {
    yield put(actions.isAdding())

    try {
        const response = yield call(api.addTicket, action.payload)
        yield put(actions.added())
    }
    catch(error) {
        yield put(actions.addingFailed(error))
    }
}

export function * getFileSaga(action){
  yield put(actions.fileIsDownloading())
  try {
      console.log('getFile')
      const response = yield call(api.getFileLink, action.payload)
      const link = response.data
      console.log(link)
      yield put(actions.fileDownloaded(link.url))
  }
  catch(error) {
      console.error(error)
      yield put(actions.fileDownloadingFailed(error))
  }
}

export function * downloadCommentsSaga(action){
  yield put(actions.commentsDownloading())
  try {
      const response = yield call(api.getTaskComments, action.payload)
      const comments = response.data
      yield put(actions.commentsDownloaded(comments))
  }
  catch(error) {
      //console.log(error)
      yield put(actions.commentsDownloadingFailed(error))
  }
}
