import { call, put } from 'redux-saga/effects'

import * as actions from '../actions/Ticket'
import api from '../../api'


export function * updateTicketSaga(action) {
    yield put(actions.isUpdating())
    try {
          console.log(action.payload.ticket.id)
          console.log(action.payload.action)
          switch(action.payload.action){
            case 'agree':
              console.log('agree saga')
              console.log(action.payload.comment)
              const agreeResponse = yield call(api.agreeTicket, action.payload.comment, action.payload.ticket.id)
              console.log(agreeResponse)
              break;

            case 'disagree':
              console.log('disagree saga')
              console.log(action.payload.comment)
              const disagreeResponse = yield call(api.disagreeTicket, action.payload.comment, action.payload.ticket.id)
              console.log(disagreeResponse)
              break;
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
        console.log(action.payload)
        const response = yield call(api.addTicket, action.payload)
        console.log(response)
        yield put(actions.added())
    }
    catch(error) {
        console.warn(error)
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
      console.log(action.payload)
      var response;
      switch(action.payload.type){
        case "documents":
          response = yield call(api.getDocumentComments, action.payload.id);
          break;
        case "tasks":
          response = yield call(api.getTaskComments, action.payload.id);
          break;
      }
      const comments = response.data
      yield put(actions.commentsDownloaded(comments))
  }
  catch(error) {
      //console.log(error)
      yield put(actions.commentsDownloadingFailed(error))
  }
}
