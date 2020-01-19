import { call, put, select } from 'redux-saga/effects'

import * as actions from '../actions/Tickets'
import api from '../../api'
import { getSession } from '../selectors'


function * dataSaga() {
    yield put(actions.isFetching())
    const store = yield select()
    const session = getSession(store)
    try {
        var data = {
          documents: [],
          tasks: []
        }
        if(session.roles.includes('sighting')){
          documentsResponse = yield call(api.fetchDocuments)
          data.documents = documentsResponse.data
        }/*
        if(session.roles.includes('user')){
          tasksResponse = yield call(api.fetchTasks)
          data.tasks = tasksResponse.data
        }*/
        yield put(actions.fetched(data))
        yield put(actions.fetched(data))
    }
    catch(error) {
        console.error(error)
        yield put(actions.fetchFailed(error))
    }
}

export default dataSaga
