import { call, put } from 'redux-saga/effects'

import * as actions from '../actions/Ticket'
import api from '../../api'


export function * updateTicketSaga(action) {
    yield put(actions.isUpdating())
    try {
        const response = yield call(api.updateTicketStatus, action.payload)
        yield put(actions.updated())
    }
    catch(error) {
        yield put(actions.updateFailed(error))
    }
}

export function * getFileSaga(action){
  yield put(actions.fileIsDownloading())
  try {
      const response = yield call(api.getFileLink, action.payload)
      const link = response.data.url
      yield put(actions.fileDownloaded(link))
  }
  catch(error) {
      //console.error(error)
      yield put(actions.fileDownloadingFailed(error))
  }
}
