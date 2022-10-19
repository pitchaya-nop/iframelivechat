import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
// import user from './user';
import common from './common'
import chat from './chat'
const reducer = combineReducers({
  // user,
  common,
  chat
})
const store = configureStore({
  reducer,
})
export default store;