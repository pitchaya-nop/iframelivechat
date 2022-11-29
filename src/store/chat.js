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
  Array.prototype.groupBy = function (field, session) {
    let groupedArr = [];
    this.forEach(function (e) {
      //look for an existent group
      let group = groupedArr.find(g => g['field'] === e[field] && g['session'] === e[session]);
      if (group == undefined) {
        //add new group if it doesn't exist
        group = { field: e[field], session: e[session], groupList: [] };
        groupedArr.push(group);
      }

      //add the element to the group
      group.groupList.push(e);
    });

    return groupedArr;
  }

  dispatch(setChat(data.groupBy('createdTimedisplay', 'sessionId')))
}

export const setunread = (data) => async dispatch => {
  dispatch(setUnread(data))
}