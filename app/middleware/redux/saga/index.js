import { takeLatest } from 'redux-saga/effects'
import { LOGIN_REQUEST } from '../actions/Session'
import { FETCH_REQUEST } from '../actions/Tickets'
import { UPDATE_TICKET_REQUEST, GET_FILE_REQUEST } from '../actions/Ticket'
import loginSaga from './Session'
import dataSaga from './Tickets'
import { updateTicketSaga, getFileSaga } from './Ticket'


function * sagaWatcher() {
    yield [
        takeLatest(LOGIN_REQUEST, loginSaga),
        takeLatest(FETCH_REQUEST, dataSaga),
        takeLatest(UPDATE_TICKET_REQUEST, updateTicketSaga),
        takeLatest(GET_FILE_REQUEST, getFileSaga)
    ]
}

export default sagaWatcher
