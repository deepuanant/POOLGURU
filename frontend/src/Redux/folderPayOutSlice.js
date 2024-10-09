import { createSlice } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';  // Import CryptoJS for decryption

// Initial state
const initialState = {
  folders: [],  // Initialize folders as an array
  folderProcessedData: {}, // Add this to store processed data by folder ID
};

// Decryption function
const decryptString = (ciphertext, key) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Define the slice
const folderPayOutSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    // Set the entire folders array (decrypt payoutData in the process)
    setFolders: (state, action) => {
      const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;  // Use the key from environment variables
      
      // Ensure action.payload is an array
      if (!Array.isArray(action.payload)) {
        console.error("Expected action.payload to be an array but got:", action.payload);
        return; // Or handle the error accordingly
      }

      // Decrypt payoutData for each folder
      state.folders = action.payload.map(folder => {
        const decryptedPayoutData = folder.payoutData.map(payout => {
          return {
            ...payout,
            data: payout.data.map(row => row.map(cell => decryptString(cell, encryptionKey))),  // Decrypt each cell in the data array
          };
        });

        return {
          ...folder,
          payoutData: decryptedPayoutData,  // Replace encrypted payoutData with decrypted version
        };
      });
    },

    // Action to add new folder
    addFolder: (state, action) => {
      state.folders.push(action.payload);
    },

    // Action to add new payout data to a specific folder
    addPayoutData: (state, action) => {
      const { folderId, payoutData } = action.payload;
      const folder = state.folders.find(folder => folder._id === folderId);
      if (folder) {
        folder.payoutData.push(payoutData);  // Add the new payoutData (file) to the folder
      }
    },

    // Rename a folder based on its ID
    renameFolder: (state, action) => {
      const { folderId, newName } = action.payload;
      const folder = state.folders.find(folder => folder._id === folderId);
      if (folder) {
        folder.folderName = newName;
      }
    },

    // Delete a folder based on its ID
    deleteFolder: (state, action) => {
      const folderId = action.payload;
      state.folders = state.folders.filter(folder => folder._id !== folderId);
    },

    // Delete a file from payoutData based on file ID
    deleteFile: (state, action) => {
      const { folderId, fileId } = action.payload;
      const folder = state.folders.find(folder => folder._id === folderId);
      if (folder) {
        folder.payoutData = folder.payoutData.filter(file => file._id !== fileId);
      }
    },

    // Set processed data for a specific folder
    setFolderProcessedData: (state, action) => {
      const { folderId, processedPayoutData } = action.payload;
      state.folderProcessedData[folderId] = processedPayoutData;
    },

    // Update processed data for a specific folder
    updateFolderProcessedData: (state, action) => {
      const { folderId, processedPayoutData } = action.payload;
      if (state.folderProcessedData[folderId]) {
        state.folderProcessedData[folderId] = processedPayoutData;
      }
    },

    // Set decrypted processed payout data for a specific folder
    setDecryptedProcessedPayoutData: (state, action) => {
      const { folderId, decryptedProcessedPayoutData } = action.payload;
      state.folderProcessedData[folderId] = decryptedProcessedPayoutData;
    },
  },
});

// Export the actions
export const { 
  setFolders, 
  addFolder, 
  renameFolder, 
  deleteFolder, 
  deleteFile, 
  addPayoutData, 
  setFolderProcessedData, 
  updateFolderProcessedData, 
  setDecryptedProcessedPayoutData // New action for decrypted processed data
} = folderPayOutSlice.actions;

// Export the reducer
export default folderPayOutSlice.reducer;
