import { Map } from 'immutable'
import { LOGIN_REQUEST, IS_LOGGING, LOGGED, LOGIN_FAILED } from '../actions/Session'

const initialState = Map({
  token: null,
  userId: null,
  user: null,
  companyId: null,
  accountId: null,
  account: null,
  roles: [],
  isLogging: false,
  logged: false,
  error: null,
  employees: []
})

const reducer = (state = initialState, action) => {
  switch (action.type){
    case LOGIN_REQUEST:
      return initialState

    case IS_LOGGING:
      return state.merge({ isLogging: true })

    case LOGGED:
      const { token, userId, user, companyId,
              accountId, account, roles, employees } = action.payload
      return state.merge({ token, userId, user, companyId, accountId,
         account, roles, employees, isLogging: false, logged: true })

    case LOGIN_FAILED:
      return state.merge({
        isLogging: false,
        error: action.payload
      })

    default:
       return state
  }
}

export default reducer
