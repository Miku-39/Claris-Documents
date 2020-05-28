import { call, put, select } from 'redux-saga/effects'

import * as actions from '../actions/Tickets'
import api from '../../api'


function * dataSaga() {
    yield put(actions.isFetching())
    const store = yield select()
    const session = store.session.toJS()

    try {
        var documents
        var tasks

        if(session.roles.includes('sighting')){
          documents = yield call(api.fetchDocuments)
        }
        if(session.roles.includes('user')){
          tasks = yield call(api.fetchTasks)
        }

        var data = {
          documents: documents ? documents.data : [],
          tasks: tasks ? tasks.data : []
        }

        data.documents = data.documents.filter((x) => {return true})

        yield put(actions.fetched(data))
        yield put(actions.isFetching())
        yield put(actions.fetched(data))
    }
    catch(error) {
        console.error(error)
        yield put(actions.fetchFailed(error))
    }
}

export default dataSaga
