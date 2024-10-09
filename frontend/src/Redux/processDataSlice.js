// processDataSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    processData: [],  // Initialize processData as an array
};

const processDataSlice = createSlice({
    name: 'processData',
    initialState,
    reducers: {
        setProcessData: (state, action) => {
            if (!Array.isArray(action.payload)) {
                console.error("Expected action.payload to be an array but got:", action.payload);
                return;
            }
            state.processData = action.payload;
        },
        addProcessData: (state, action) => {
            state.processData.push(action.payload);
        },
        deleteProcessData: (state, action) => {
            state.processData = state.processData.filter((process) => process.id !== action.payload.id);
        },
    },
});

export const { setProcessData, addProcessData, deleteProcessData } = processDataSlice.actions;

export default processDataSlice.reducer;
