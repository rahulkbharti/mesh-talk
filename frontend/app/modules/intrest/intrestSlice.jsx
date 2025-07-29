import { createSlice } from "@reduxjs/toolkit";
import { generateUsername } from "../../utils/randomUserNameGenerator";

const userSlice = createSlice({
  name: "user",
  initialState: {
    username: generateUsername(),
    chatType: "video",
    interests: [],
    country: "India",
  },
  reducers: {
    setUserData: (state, action) => {
      state = action.payload;
    },
    addInterest: (state, action) => {
      state.interests.push(action.payload);
    },
    removeInterest: (state, action) => {
      state.interests = state.interests.filter(
        (interest) => interest !== action.payload
      );
    },
    removeAllInterests: (state) => {
      state.interests = [];
    },
  },
});

export const { setUserData, addInterest, removeInterest, removeAllInterests } =
  userSlice.actions;
export default userSlice.reducer;
