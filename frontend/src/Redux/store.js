import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userslice';
import payOutDataReducer from './payoutDataSlice';
import folderPayOutReducer from './folderPayOutSlice';
import processDataReducer from './processDataSlice';
import profileReducer from './profileSlice';

// Configure the store
const store = configureStore({
  reducer: {
    user: userReducer,
    payout: payOutDataReducer,
    folders: folderPayOutReducer,
    processData: processDataReducer,
    profile: profileReducer,
  },
});

export default store;
