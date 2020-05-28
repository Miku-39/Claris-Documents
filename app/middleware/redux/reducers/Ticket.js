import { Map } from 'immutable'
import * as actions from '../actions/Ticket'
import {
  ADD_TICKET_REQUEST,
  IS_ADDING,
  ADDED,
  ADDING_FAILED,
  UPDATE_TICKET_REQUEST,
  IS_UPDATING,
  UPDATED,
  UPDATE_FAILED,
  CLEAR_FLAGS } from '../actions/Ticket'

import {
  GET_FILE_REQUEST,
  FILE_IS_DOWNLOADING,
  FILE_DOWNLOADING_FAILED,
  FILE_DOWNLOADED} from '../actions/Ticket'

import {
  DOWNLOAD_COMMENTS_REQUEST,
  COMMENTS_DOWNLOADING,
  COMMENTS_DOWNLOADING_FAILED,
  COMMENTS_DOWNLOADED
} from '../actions/Ticket'

const initialState = Map({
    item: null,
    isUpdating: false,
    updated: false,
    updatingFailed: false,
    isAdding: false,
    added: false,
    fileIsDownloading: false,
    fileDownloaded: false,
    commentsDownloadingFailed: false,
    link: null,
    comments: [],
    error: null
})

export default ticketReducer = (state = initialState, action) => {
    switch (action.type){
        case ADD_TICKET_REQUEST:
            return initialState

        case IS_ADDING:
            return state.merge({ isAdding: true })

        case ADDED:
            return state.merge({ isAdding: false, added: true })

        case ADDING_FAILED:
            return state.merge({ isAdding: false, error: action.payload })

        case UPDATE_TICKET_REQUEST:
            return initialState

        case IS_UPDATING:
            return state.merge({ isUpdating: true, updatingFailed: false })

        case UPDATED:
            return state.merge({ isUpdating: false, updated: true })

        case UPDATE_FAILED:
            return state.merge({ isUpdating: false, updatingFailed: true, error: action.payload })

       case CLEAR_FLAGS:
            return state.merge({ updated: false, added: false })

        case GET_FILE_REQUEST:
            return initialState

        case FILE_IS_DOWNLOADING:
            return state.merge({ fileIsDownloading: true })

        case FILE_DOWNLOADED:
            return state.merge({ fileIsDownloading: false, fileDownloaded: true, link: action.payload })

        case FILE_DOWNLOADING_FAILED:
            return state.merge({ fileIsDownloading: false, error: action.payload })

        case DOWNLOAD_COMMENTS_REQUEST:
            return initialState

        case COMMENTS_DOWNLOADING:
            return state.merge({ commentsDownloading: true, commentsDownloadingFailed: false })

        case COMMENTS_DOWNLOADED:
            return state.merge({ commentsDownloading: false, commentsDownloaded: true, comments: action.payload })

        case COMMENTS_DOWNLOADING_FAILED:
            return state.merge({ commentsDownloading: false, commentsDownloadingFailed: true, error: action.payload })

        default: return state
    }
}
