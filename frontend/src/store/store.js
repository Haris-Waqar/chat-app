import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "@/store/slices/UserSlice.js";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: UserReducer,
    },
  });
};
