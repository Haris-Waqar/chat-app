import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    selectedUser: null,
    lastMessages: {},
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setLastMessages(state, action) {
      state.lastMessages = action.payload;
    },
    updateLastMessage(state, action) {
      console.log("slice before", JSON.stringify(state.lastMessages));
      const { userId, lastMessage } = action.payload;
      state.lastMessages[userId] = lastMessage;
      console.log("slice after", JSON.stringify(state.lastMessages));
    },
  },
});

export const { setUsers, setSelectedUser, setLastMessages, updateLastMessage } =
  userSlice.actions;
export default userSlice.reducer;
