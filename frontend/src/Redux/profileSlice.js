// src/Redux/profileSlice.js
import { createSlice } from "@reduxjs/toolkit";
const user = JSON.parse(localStorage.getItem("user"));

const initialState = user
  ? user
  : {
      email: "",
      username: "",
      role: "",
      _id: "",
      twoFactorEnabled: "",
      otpVerify: "", // Corrected the typo here
      isVerified: false,
    };

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateProfileField: (state, action) => {
        const {
            email,
            username,
            firstname,
            lastname,
            location,
            designation,
            companyname,
            about,
        } = action.payload;
        state.email = email;
        state.username = username;
        state.firstname = firstname;
        state.lastname = lastname;
        state.location = location;
        state.designation = designation;
        state.companyname = companyname;
        state.about = about;
    },
    resetProfile: () => initialState,
  },
});

export const { setProfile, updateProfileField, resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
