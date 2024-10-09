import axios from "axios";

// Determine which host to use based on the .env setting
const useLocal = import.meta.env.VITE_USE_LOCAL === "false";
const host = useLocal ? import.meta.env.VITE_LOCAL_URL : import.meta.env.VITE_SERVER_URL;
// <--------------------- Payout Monitorings API --------------------->

// create batch API
export const createBatch = async (status, phases, userId) => {
    try {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const response = await axios.post(`${host}/api/v1/payoutbatches/add`, {
            status,
            phases,
            userId,
        }, {
            headers,
        });
        return response;
    } catch (error) {
        console.error("Error from createBatch API", error.response ? error.response.data : error.message);
        throw error; // Optionally re-throw the error for further handling
    }
};

// Retrieve all Batches API
export const getAllBatches = async () => {
    try {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const response = await axios.get(`${host}/api/v1/payoutbatches/getAll`, {
            headers,
        });
        return response;
    } catch (error) {
        console.error("Error in getAllBatches API", error.response ? error.response.data : error.message);
        throw error; // Optionally re-throw the error for further handling
    }
};

// Retrieve a single Batch with id
export const getSingleBatch = async (id) => {
    try {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const response = await axios.get(`${host}/api/v1/payoutbatches/get/${id}`, {
            headers,
        });
        return response;
    } catch (error) {
        console.error("Error from getSingleBatch API", error.response ? error.response.data : error.message);
        throw error; // Optionally re-throw the error for further handling
    }
};

// Delete a Batch with id
export const deleteSingleBatchById = async (id) => {
    try {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const response = await axios.delete(`${host}/api/v1/payoutbatches/delete/${id}`, {
            headers,
        });
        return response;
    } catch (error) {
        console.error("Error from deleteSingleBatchById API", error.response ? error.response.data : error.message);
        throw error; // Optionally re-throw the error for further handling
    }
};

// <--------------------------- Payoutdata API --------------------------->

export const uploadPayoutData = async (folderId, data) => {
    try {
        const response = await axios.post(`${host}/api/v1/payoutdata/savepayoutdata/${folderId}`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response; // Ensure this returns the full response object
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.log("Server Error:", error.response.data);
            if (error.response.data.message === 409) {
                console.log("Duplicate Data");
            }
        } else if (error.request) {
            // Request was made but no response received
            console.log("No response received:", error.request);
        } else {
            // Error occurred during request setup
            console.log("Request setup error:", error.message);
        }
        throw error; // Optionally re-throw the error for further handling
    }
};

// Get all payout data for a specific folder (folderId in params)
export const getPayoutData = async (folderId) => {
    try {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const response = await axios.get(`${host}/api/v1/payoutdata/getpayoutdata/${folderId}`, {
            headers,
        });
        return response;
    } catch (error) {
        console.error("Error from getPayoutData API", error.response ? error.response.data : error.message);
        throw error; // Optionally re-throw the error for further handling
    }
}

// Get specific payout data by its ID
export const getPayoutDataById = async (id) => {
    try {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const response = await axios.get(`${host}/api/v1/payoutdata/getpayoutdatabyid/${id}`, {
            headers,
        });
        return response;
    } catch (error) {
        console.error("Error from getPayoutDataById API", error.response ? error.response.data : error.message);
        throw error; // Optionally re-throw the error for further handling
    }
};

// Delete all payout data for a specific folder (folderId in params)
export const deleteAllPayoutData = async (folderId) => {
    try {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const response = await axios.delete(`${host}/api/v1/payoutdata/deleteallpayoutdata/${folderId}`, {
            headers,
        });
        return response.data; // Return the response data from the API
    } catch (error) {
        console.error("Error from deleteAllPayoutData API", error.response ? error.response.data : error.message);
        throw error; // Optionally re-throw the error for further handling
    }
};


// Delete specific payout data by its ID
export const deletePayoutDataById = async (payoutId) => {
    try {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const response = await axios.delete(`${host}/api/v1/payoutdata/deletepayoutdata/${payoutId}`, {
            headers,
        });
        return response.data; // Return the response data from the API
    } catch (error) {
        console.error("Error from deletePayoutDataById API", error.response ? error.response.data : error.message);
        throw error; // Optionally re-throw the error for further handling
    }
};

// <--------------------- Folder API --------------------->

// Create a Folder
export const createFolder = async (folderName, userId) => {
    try {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const response = await axios.post(`${host}/api/v1/folder/create`, {
            folderName,
            userId,
        }, {
            headers,
        });
        return response;
    } catch (error) {
        console.error("Error from createFolder API", error.response ? error.response.data : error.message);
        throw error; // Optionally re-throw the error for further handling
    }
}

// Get Folders for a User
export const getFolders = async (userId) => {
    try {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const response = await axios.get(`${host}/api/v1/folder/find`, {
            headers,
            params: { userId } // Use params to pass userId
        });
        return response;
    } catch (error) {
        console.error("Error from getFolders API", error.response ? error.response.data : error.message);
        throw error; // Optionally re-throw the error for further handling
    }
}

// Get a Single Folder by ID
// export const getFolderById = async (folderId) => {
//     try {
//         const headers = {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//         };
//         const response = await axios.get(`${host}/api/v1/folder/find/${folderId}`, {
//             headers,
//         });
//         return response;
//     } catch (error) {
//         console.error("Error from getFolderById API", error.response ? error.response.data : error.message);
//         throw error; // Optionally re-throw the error for further handling
//     }
// }

// Update a Folder by ID
export const updateFolderById = async (folderId, folderData) => {
    try {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        // Change id to folderid in the API call
        const response = await axios.put(`${host}/api/v1/folder/update/${folderId}`, folderData, {
            headers,
        });
        return response;
    } catch (error) {
        console.error("Error from updateFolderById API", error.response ? error.response.data : error.message);
        throw error; // Optionally re-throw the error for further handling
    }
};

// Delete a Folder by ID
export const deleteFolderById = async (folderId) => {
    try {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const response = await axios.delete(`${host}/api/v1/folder/delete/${folderId}`, {
            headers,
        });
        return response;
    } catch (error) {
        console.error("Error from deleteFolderById API", error.response ? error.response.data : error.message);
        throw error; // Optionally re-throw the error for further handling
    }
}

// Delete All Folders
export const deleteAllFolders = async () => {
    try {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const response = await axios.delete(`${host}/api/v1/folder/deleteAll`, {
            headers,
        });
        return response;
    } catch (error) {
        console.error("Error from deleteAllFolders API", error.response ? error.response.data : error.message);
        throw error; // Optionally re-throw the error for further handling
    }
}

export const CreateSettings = async (folderID, data) => {
    try {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const response = await axios.post(`${host}/api/v1/settings/create/${folderID}`, data, {
            headers,
        });
        return response;
    } catch (error) {
        console.error("Error from CreateSettings API", error.response ? error.response.data : error.message);
        throw error; // Optionally re-throw the error for further handling
    }
}

// fetch initialData from the API
export const getSettings = async (folderId) => {
    try {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const response = await axios.get(`${host}/api/v1/settings/findOne/${folderId}`, {
            headers,
        });
        return response;
    } catch (error) {
        // console.error("Error from getSettings API", error.response ? error.response.data : error.message);
        throw error; // Optionally re-throw the error for further handling
    }
}

export const UpdateSettings = async (folderID, data) => {
    try {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const response = await axios.put(`${host}/api/v1/settings/update/${folderID}`, data, {
            headers,
        });
        return response;
    } catch (error) {
        console.error("Error from UpdateSettings API", error.response ? error.response.data : error.message);
        throw error; // Optionally re-throw the error for further handling
    }
};

// ------------------------////process data-------------------------------------------------------------
// Get processed payout data for a specific folder

// Fetch all processed data for a specific folder
// Fetch all processed payout data for a specific folder
// Fetch processed payout data by processId
export const getProcessedPayoutData = async (processDataId, folderId) => {
    try {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        // Make the API call to fetch the processed data by processId
        const response = await axios.get(`${host}/api/v1/processdata/get/${folderId}/${processDataId}`, {
            headers,
        });

        return response.data; // Return the processed data
    } catch (error) {
        console.error("Error from getProcessedPayoutData API", error.response ? error.response.data : error.message);
        throw error; // Optionally re-throw the error for further handling
    }
};


// Fetch processed folder metadata for a specific folder
export const getProcessFolder = async (folderId) => {
    try {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        // API call to get processed folder metadata
        const response = await axios.get(`${host}/api/v1/processdata/getAll/${folderId}`, {
            headers,
        });

        return response.data; // Return the processed folder metadata
    } catch (error) {
        if (error.response) {
            // Handle server response errors
            console.error("Error from getProcessFolder API:", error.response.data);
        } else if (error.request) {
            // Handle case where request was made but no response received
            console.error("No response received from getProcessFolder:", error.request);
        } else {
            // Handle other errors such as network issues or request setup issues
            console.error("Error setting up request for getProcessFolder:", error.message);
        }
        throw error; // Re-throw the error for further handling
    }
};


// Upload processed data for a specific folder
export const uploadProcessedData = async (folderId, data) => {
    try {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        // Make the API call to save processed data
        const response = await axios.post(`${host}/api/v1/processdata/save/${folderId}`, data = { data }, {
            headers,
        });

        return response.data; // Return the data object
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error("Server Error:", error.response.data);
            if (error.response.status === 409) {
                console.error("Duplicate Data");
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error("No response received:", error.request);
        } else {
            // Error occurred during request setup
            console.error("Request setup error:", error.message);
        }
        throw error; // Optionally re-throw the error for further handling
    }
};
