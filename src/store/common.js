import { createSlice } from '@reduxjs/toolkit'
// Slice
const slice = createSlice({
  name: 'common',
  initialState: {
    topbarDisplay: null,
    livechatClassname: null,
    imageofficial: null,
    roomdetail: null
  },
  reducers: {
    setTopbarDisplay: (state, action) => {
      state.topbarDisplay = action.payload;
    },
    setLivechatClassname: (state, action) => {
      state.livechatClassname = action.payload
    },
    setImageDisplay: (state, action) => {
      state.imageofficial = action.payload
    },
    setRoomdetail: (state, action) => {
      state.roomdetail = action.payload
    }
  },
});
export default slice.reducer


// Actions
const { setTopbarDisplay, setLivechatClassname, setImageDisplay, setRoomdetail } = slice.actions

export const settopbar = (data) => async dispatch => {
  dispatch(setTopbarDisplay(data))
}

export const setclassname = (data) => async dispatch => {
  dispatch(setLivechatClassname(data))
}

export const setimagedisplay = (imagesource) => async dispatch => {
  dispatch(setImageDisplay(imagesource))
}

export const setroomdetail = (roomdetail) => async dispatch => {
  dispatch(setRoomdetail(roomdetail))
}