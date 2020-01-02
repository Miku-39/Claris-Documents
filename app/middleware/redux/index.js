import { Platform } from 'react-native';
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import Immutable from 'immutable'

import rootReducer from './reducers'
import saga from './saga' 

const sagaMiddleware = createSagaMiddleware()
//const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)))
const middlewares = [sagaMiddleware]//, logger]
const store = createStore(rootReducer, applyMiddleware(...middlewares))

sagaMiddleware.run(saga)

export default store
