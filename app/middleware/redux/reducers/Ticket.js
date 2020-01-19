import { Map } from 'immutable'
import * as actions from '../actions/Ticket'
import { UPDATE_REQUEST, IS_UPDATING, UPDATED, UPDATE_FAILED, CLEAR_FLAGS } from '../actions/Ticket'
import { GET_FILE_REQUEST, FILE_IS_DOWNLOADING, FILE_DOWNLOADING_FAILED,
         FILE_DOWNLOADED} from '../actions/Ticket'

const initialState = Map({
    item: null,
    isUpdating: false,
    updated: false,
    fileIsDownloading: false,
    fileDownloaded: false,
    link: null,
    error: null
})

export default ticketReducer = (state = initialState, action) => {
    switch (action.type){
        case UPDATE_REQUEST:
            return initialState

        case IS_UPDATING:
            return state.merge({ isUpdating: true })

        case UPDATED:
            return state.merge({ isUpdating: false, updated: true })

        case UPDATE_FAILED:
            return state.merge({ isUpdating: false, error: action.payload })

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

        default: return state
    }
}
