import React, { useState, useEffect } from "react";
import {
  CreateSettings,
  UpdateSettings,
  getSettings,
} from "../../../../api/servicesapi";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const SettingModal = ({ isOpen, onClose, folderId }) => {
  const [initialData, setInitialData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [fetchStatus, setFetchStatus] = useState(null);
  const [formValues, setFormValues] = useState({
    dealName: "",
    assignor: "",
    assignees: "",
    dateofDisbursement: "",
    noOfObligors: "",
    disbursedAmount: "",
    assignorShare: "",
    assigneeShare: "",
  });

  useEffect(() => {
    if (isOpen) {
      resetForm();
      fetchInitialData();
    }
  }, [isOpen]);

  const fetchInitialData = async () => {
    try {
      const response = await getSettings(folderId);
      // console.log(response);
      setInitialData(response);
      setFormValues({
        dealName: response.data.dealName || "",
        assignor: response.data.assignor || "",
        assignees: response.data.assignees || "",
        dateofDisbursement: response.data.dateofDisbursement || "",
        noOfObligors: response.data.noOfObligors || "",
        disbursedAmount: formatNumberWithCommas(
          response.data.disbursedAmount || ""
        ), // format the fetched amount
        assignorShare: response.data.assignorShare || "",
        assigneeShare: response.data.assigneeShare || "",
      });
      setHasError(false);
      setFetchStatus(response.status); // Set fetch status
    } catch (error) {
      // console.error(error);
      resetForm();
      setHasError(true);
      setFetchStatus(error.response ? error.response.status : null); // Set fetch status
    }
  };

  const resetForm = () => {
    setInitialData(null);
    setFormValues({
      dealName: "",
      assignor: "",
      assignees: "",
      dateofDisbursement: "",
      noOfObligors: "",
      disbursedAmount: "",
      assignorShare: "",
      assigneeShare: "",
    });
    setIsEditing(false);
  };

  const formatNumberWithCommas = (value) => {
    if (!value) return "";
    return parseFloat(value).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate percentage format for assignorShare and assigneeShare
    if (name === "assignorShare" || name === "assigneeShare") {
      const percentageRegex = /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/;
      if (!percentageRegex.test(value) && value !== "") {
        toast.error(
          "Please enter a valid percentage (0-100) with up to 2 decimal places."
        );
        return;
      }
    }

    // Format disbursedAmount with commas as user types
    if (name === "disbursedAmount") {
      const numericValue = value.replace(/,/g, ""); // Remove commas for internal storage
      const formattedValue = formatNumberWithCommas(numericValue); // Format value with commas

      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: formattedValue, // Set the formatted value with commas
      }));
      return;
    }

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    // Automatically update assigneeShare based on assignorShare
    if (name === "assignorShare") {
      const assignorShareValue = parseFloat(value);
      if (!isNaN(assignorShareValue)) {
        setFormValues((prevValues) => ({
          ...prevValues,
          assigneeShare: (100 - assignorShareValue).toFixed(2),
        }));
      }
    }

    // Automatically update assignorShare based on assigneeShare
    if (name === "assigneeShare") {
      const assigneeShareValue = parseFloat(value);
      if (!isNaN(assigneeShareValue)) {
        setFormValues((prevValues) => ({
          ...prevValues,
          assignorShare: (100 - assigneeShareValue).toFixed(2),
        }));
      }
    }
  };

  async function getPayoutDataFromIndexedDB(folderId) {
    return new Promise((resolve, reject) => {
      const openDB = indexedDB.open("PayoutData");

      openDB.onsuccess = function (event) {
        const db = event.target.result;

        const transaction = db.transaction("Folders", "readonly");
        const objectStore = transaction.objectStore("Folders");
        const uniqueKey = folderId;
        const request = objectStore.get(uniqueKey);

        request.onsuccess = function (event) {
          const result = event.target.result;
          if (result) {
            // console.log(`Data retrieved for folder`, result);
            resolve(result.data);
          } else {
            // console.log(`No data found for folder: with ID: ${folderId}`);
            resolve(null);
          }
          db.close();
        };

        request.onerror = function (event) {
          console.error(
            `Error retrieving data for folder with ID: ${folderId}`,
            event
          );
          db.close();
          reject(event);
        };
      };

      openDB.onerror = function (event) {
        console.error("Error opening database:", event);
        reject(event);
      };
    });
  }

  async function fetchPayoutData(folderId) {
    try {
      const payoutData = await getPayoutDataFromIndexedDB(folderId);
      if (payoutData) {
        // console.log("Payout data:", payoutData);
        return { data: payoutData };
        // Use the payoutData as needed (e.g., update state, display in UI)
      } else {
        // console.log("No payout data found for this folder and ID");
        return null;
      }
    } catch (error) {
      console.error("Error fetching payout data:", error);
      return null;
      // Handle the error (e.g., show an error message to the user)
    }
  }

  async function updateFolderData(id, newFolderName, newData, processeddata) {
    return new Promise((resolve, reject) => {
      const openDB = indexedDB.open("PayoutData");

      openDB.onsuccess = function () {
        const db = openDB.result;
        const tx = db.transaction("Folders", "readwrite");
        const store = tx.objectStore("Folders");

        // Retrieve the existing entry to update it
        const request = store.get(id);

        request.onsuccess = function (event) {
          const existingRecord = event.target.result;

          if (existingRecord) {
            // Update the fields as necessary
            existingRecord.folderName =
              newFolderName || existingRecord.folderName;
            existingRecord.data.settings = newData;
            existingRecord.processeddata =
              processeddata || existingRecord.processeddata;

            // Use put to update the record with the new details
            const updateRequest = store.put(existingRecord);

            updateRequest.onsuccess = function () {
              // console.log(`Data updated for ID: ${id}`);
              resolve();
            };

            updateRequest.onerror = function (event) {
              console.error(`Failed to update data for ID: ${id}`, event);
              reject(event);
            };
          } else {
            reject(new Error(`No record found with ID: ${id}`));
          }
        };

        request.onerror = function (event) {
          console.error(`Error retrieving record for ID: ${id}`, event);
          reject(event);
        };

        tx.oncomplete = function () {
          db.close();
        };
      };

      openDB.onerror = function (event) {
        console.error("Database error:", event);
        reject(event);
      };
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { ...formValues };
    formData.disbursedAmount = formData.disbursedAmount.replace(/,/g, ""); // Remove commas before submitting

    try {
      const response = await CreateSettings(folderId, formData);
      const indexeddata = await fetchPayoutData(folderId);
      // console.log("indexeddata", indexeddata);
      if (indexeddata) {
        await updateFolderData(folderId, null, response.data.data, null);
      }
      // console.log(response);
      // console.log("form data", formData);
      // await updateFolderData(folderId, null, settings, null);
      if (response.data.success) {
        toast.success("Settings saved successfully.");
        onClose();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("A setting for this folder already exists");
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    const formData = { ...formValues };
    formData.disbursedAmount = formData.disbursedAmount.replace(/,/g, ""); // Remove commas before submitting

    try {
      // console.log("form data", formData);
      const response = await UpdateSettings(folderId, formData);
      // console.log("response", response);
      // console.log(response);
      if (response.status === 200) {
        const indexeddata = await fetchPayoutData(folderId);
        // console.log("indexeddata", indexeddata);
        if (indexeddata) {
          await updateFolderData(folderId, null, response.data.setting, null);
        }

        toast.success("Settings updated successfully.");
        onClose();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("First save the settings, then update the details.");
      console.error(error);
    }
  };

  const formatLabel = (key) => {
    let formattedKey =
      key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");
    formattedKey = formattedKey.replace(" Of ", " of ");
    formattedKey = formattedKey.replace("No ", "No. ");
    if (key === "assignorShare") {
      formattedKey = "Assignor (Originator) Share (%)";
    }
    if (key === "assigneeShare") {
      formattedKey = "Assignee (Investor) Share (%)";
    }
    if (key === "assignor") {
      formattedKey = "Assignor (Originator) Name";
    }
    if (key === "assignees") {
      formattedKey = "Assignee (Investor) Name";
    }
    if (key === "dateofDisbursement") {
      formattedKey = "Date of Disbursement";
    }
    return formattedKey;
  };

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-sm z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center bg-gradient-to-r from-orange-500 to-yellow-500 p-4 rounded-t-lg">
              <h3 className="text-xl font-semibold text-white">
                Deal Settings
              </h3>
              <button
                className="text-white text-2xl hover:text-orange-500 transition-all duration-200"
                onClick={onClose}
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form className="mt-4 space-y-4 p-4">
              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">
                    {formatLabel("dealName")}
                  </label>
                  <input
                    type="text"
                    name="dealName"
                    value={formValues.dealName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={`Enter ${formatLabel("dealName")}`}
                    disabled={!isEditing && initialData !== null}
                  />
                </div>

                <div>
                  <label className="block text-gray-700">
                    {formatLabel("dateofDisbursement")}
                  </label>
                  <input
                    type="date"
                    name="dateofDisbursement"
                    value={formValues.dateofDisbursement}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    disabled={!isEditing && initialData !== null}
                  />
                </div>

                <div>
                  <label className="block text-gray-700">
                    {formatLabel("noOfObligors")}
                  </label>
                  <input
                    type="number"
                    name="noOfObligors"
                    value={formValues.noOfObligors}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={`Enter ${formatLabel("noOfObligors")}`}
                    disabled={!isEditing && initialData !== null}
                  />
                </div>

                <div>
                  <label className="block text-gray-700">
                    {formatLabel("disbursedAmount")}
                  </label>
                  <input
                    type="text"
                    name="disbursedAmount"
                    value={formValues.disbursedAmount}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={`Enter ${formatLabel("disbursedAmount")}`}
                    disabled={!isEditing && initialData !== null}
                  />
                </div>

                <div>
                  <label className="block text-gray-700">
                    Assignor (Originator) Name
                  </label>
                  <input
                    type="text"
                    name="assignor"
                    value={formValues.assignor}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter Assignor (Originator) Name"
                    disabled={!isEditing && initialData !== null}
                  />
                </div>

                <div>
                  <label className="block text-gray-700">
                    Assignee (Investor) Name
                  </label>
                  <input
                    type="text"
                    name="assignees"
                    value={formValues.assignees}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter Assignee (Investor) Name"
                    disabled={!isEditing && initialData !== null}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">
                    {formatLabel("assignorShare")}
                  </label>
                  <input
                    type="number"
                    name="assignorShare"
                    value={formValues.assignorShare}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={`Enter ${formatLabel("assignorShare")}`}
                    disabled={!isEditing && initialData !== null}
                  />
                </div>

                <div>
                  <label className="block text-gray-700">
                    {formatLabel("assigneeShare")}
                  </label>
                  <input
                    type="number"
                    name="assigneeShare"
                    value={formValues.assigneeShare}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={`Enter ${formatLabel("assigneeShare")}`}
                    disabled={!isEditing && initialData !== null}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 gap-2">
                {!isEditing && !hasError ? (
                  <button
                    type="button"
                    className="text-orange-500 px-4 py-2 rounded-lg hover:bg-gradient-to-r from-orange-500 to-yellow-500 hover:text-white"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    {fetchStatus !== 200 && (
                      <button
                        type="button"
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-yellow-500 hover:to-orange-500 hover:shadow-xl"
                        onClick={handleSubmit}
                      >
                        Save
                      </button>
                    )}
                    {fetchStatus === 200 && (
                      <button
                        type="button"
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-yellow-500 hover:to-orange-500 hover:shadow-xl"
                        onClick={handleUpdate}
                      >
                        Update
                      </button>
                    )}
                  </>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default SettingModal;
