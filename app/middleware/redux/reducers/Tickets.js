import { Map } from 'immutable'
import { FETCH_REQUEST, IS_FETCHING, FETCHED, FETCH_FAILED } from '../actions/Tickets'


const initialState = Map({
    documents: [],
    tasks: [],
    isFetching: false,
    fetched: false,
    error: null
})

export default ticketsReducer = (state = initialState, action) => {
    switch (action.type){
        case FETCH_REQUEST:
            return state.merge({isFetching: false, fetched: false, error: null})

        case IS_FETCHING:
            return state.merge({isFetching: true})

        case FETCHED:
            return state.merge({isFetching: false, fetched: true,
               documents: action.payload.documents, tasks: action.payload.tasks })

        case FETCH_FAILED:
            return state.merge({isFetching: false, error: action.payload})

        default: return state
    }
}
