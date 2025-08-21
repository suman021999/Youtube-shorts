// store/blurSlice.js
import { createSlice } from "@reduxjs/toolkit";

const blurSlice = createSlice({
  name: "blur",
  initialState: {
    isBlurred: false,
  },
  reducers: {
    enableBlur: (state) => {
      state.isBlurred = true;
    },
    disableBlur: (state) => {
      state.isBlurred = false;
    },
  },
});

export const { enableBlur, disableBlur } = blurSlice.actions;
export default blurSlice.reducer;
