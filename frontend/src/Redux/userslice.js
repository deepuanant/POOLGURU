import { createSlice } from "@reduxjs/toolkit";
const user = JSON.parse(localStorage.getItem("user"));

const initialState = user
  ? user
  : {
    email: "",
    username: "",
    role: "",
    id: "",
    twoFactorEnabled: "",
    otpVerify: "", // Corrected the typo here
    isVerified: false,
  };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      // console.log(action.payload); // Logging action payload to verify the data
      const {
        email,
        username,
        firstname,
        lastname,
        location,
        designation,
        companyname,
        about,
        id,
        role,
        twoFactorEnabled,
        otpVerify,
        profilephoto,
        verified2fa,
        twofactorqr,
        isVerified,
      } = action.payload;
      state.email = email;
      state.username = username;
      state.firstname = firstname;
      state.lastname = lastname;
      state.location = location;
      state.designation = designation;
      state.companyname = companyname;
      state.about = about;
      state.role = role;
      state._id = id;
      state.twoFactorEnabled = twoFactorEnabled;
      state.otpVerify = otpVerify; // Correct typo
      state.profilephoto = profilephoto;
      state.verified2fa = verified2fa;
      state.twofactorqr = twofactorqr;
      state.isVerified = isVerified;
    },
    clearUser: (state) => {
      state.email = null;
      state.username = null;
      state.lastname = null;
      state.location = null;
      state.designation = null;
      state.companyname = null;
      state.about = null;
      state.role = null;
      state._id = null;
      state.twoFactorEnabled = null;
      state.otpVerify = null;
      state.isVerified = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token"); // Also remove token on logout
    },
  },
});

export const { addUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
