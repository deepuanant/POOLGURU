import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  payoutData: [],
};

const payoutDataSlice = createSlice({
  name: 'payoutData',
  initialState,
  reducers: {
    addPayoutData: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.payoutData = action.payload;
      } else {
        console.error("Payload is not an array");
      }
    },
    clearPayoutData: (state) => {
      state.payoutData = [];
    },
    setFolderPayoutData: (state, action) => {
      state.payoutData = action.payload;
    },
  },
});

export const { addPayoutData, clearPayoutData, setFolderPayoutData } = payoutDataSlice.actions;
export default payoutDataSlice.reducer;
