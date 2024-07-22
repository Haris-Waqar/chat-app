import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,
  },
  reducers: {
    setSocket: (state, action) => {
      console.log("set socket called");
      state.socket = action.payload;
    },
  },
});

export const { setSocket } = userSlice.actions;
export default userSlice.reducer;
