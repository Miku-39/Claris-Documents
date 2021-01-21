import { takeLatest } from 'redux-saga/effects'
import { LOGIN_REQUEST } from '../actions/Session'
import { FETCH_REQUEST } from '../actions/Tickets'
import { UPDATE_TICKET_REQUEST, GET_FILE_REQUEST,
         AGREE_TICKET_REQUEST, ADD_TICKET_REQUEST,
         ADD_FILE_REQUEST,
         DOWNLOAD_COMMENTS_REQUEST } from '../actions/Ticket'
import loginSaga from './Session'
import dataSaga from './Tickets'
import { updateTicketSaga, getFileSaga,
         agreeDisagreeSaga, addTicketSaga,
         addFileSaga,
         downloadCommentsSaga } from './Ticket'


function * sagaWatcher() {
    yield [
        takeLatest(LOGIN_REQUEST, loginSaga),
        takeLatest(FETCH_REQUEST, dataSaga),
        takeLatest(UPDATE_TICKET_REQUEST, updateTicketSaga),
        takeLatest(ADD_TICKET_REQUEST, addTicketSaga),
        takeLatest(ADD_FILE_REQUEST, addFileSaga),
        takeLatest(GET_FILE_REQUEST, getFileSaga),
        takeLatest(DOWNLOAD_COMMENTS_REQUEST, downloadCommentsSaga)
    ]
}

export default sagaWatcher
