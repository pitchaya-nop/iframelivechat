import { createSlice } from '@reduxjs/toolkit'
// Slice
const slice = createSlice({
  name: 'chat',
  initialState: {
    chatMesage: localStorage.getItem('message') ? JSON.parse(localStorage.getItem('message')) : [],
    firstmessageunread: null
  },
  reducers: {
    setChat: (state, action) => {
      state.chatMesage = action.payload;
    },
    setUnread: (state, action) => {
      state.firstmessageunread = action.payload
    }
  },
});
export default slice.reducer


// Actions
const { setChat, setUnread } = slice.actions

export const setchat = (data) => async dispatch => {
  dispatch(setChat(data))
}

export const setunread = (data) => async dispatch => {
  dispatch(setUnread(data))
}