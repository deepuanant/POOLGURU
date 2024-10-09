import React, { useState, useEffect, useCallback } from "react";
import {
  FiChevronRight,
  FiUpload,
  FiLoader,
  FiSave,
  FiTrash,
} from "react-icons/fi";
import { PiSelectionAllLight, PiSelectionAllFill } from "react-icons/pi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaFolder } from "react-icons/fa";
import { LiaFileSolid } from "react-icons/lia";
import { IoSettingsSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import FileListModal from "../FiltersideBar/FileListModal"; // Import the modal component
import CryptoJS from "crypto-js"; // Import CryptoJS for decryption
import {
  getPayoutData,
  deletePayoutDataById,
} from "../../../../api/servicesapi";

const monthStringToDate = (monthString) => {
  const [month, year] = monthString.split("-");
  const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
  return new Date(year, monthIndex);
};

// Map full month names to abbreviations
const monthMap = {
  january: "jan",
  february: "feb",
  march: "mar",
  april: "apr",
  may: "may",
  june: "jun",
  july: "jul",
  august: "aug",
  september: "sep",
  october: "oct",
  november: "nov",
  december: "dec",
};

const Accordion = ({
  folder,
  isOpen, // Accordion-specific open state
  onToggle, // Accordion-specific toggle function
  onUploadClick,
  onProcessClick,
  onRenameClick,
  onDeleteClick,
  handleSettingModal,
  isRenaming,
  setNewFolderName,
  handleSaveRename,
  newFolderName,
  onFileClick,
  message,
  setmessage,
  processedData,
  setIsProgressModalOpen,
}) => {
  // const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [hasProcessedData, setHasProcessedData] = useState(false); // Track processed data

  // const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY; // Use the key from environment variables

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  const onFileDeleteClick = async (fileId) => {
    // console.log("Attempting to delete file with ID:", fileId);
    // console.log("Current files state:", files);

    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const response = await deletePayoutDataById(fileId);
          // console.log("Response:", response);

          await updateindexafterdeltion(
            folder._id,
            null,
            response.remainingPayoutData,
            null
          );

          const updatedFiles = files.filter((file) => file._id !== fileId);
          setFiles(updatedFiles);
          resolve("File deleted successfully!");
        } catch (error) {
          console.error("Error deleting file:", error);
          reject(new Error("Failed to delete file."));
        }
      }),
      {
        loading: "Deleting file...",
        success: "File deleted successfully!",
        error: "Failed to delete file.",
      }
    );
  };

  // update indexed after deletion
  async function updateindexafterdeltion(
    id,
    newFolderName,
    newData,
    processeddata
  ) {
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
            existingRecord.data.data = newData;
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

  // get payoutdata from indexeddb
  async function getPayoutDataFromIndexedDB(folderName, folderId) {
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
            // console.log(`Data retrieved for folder: ${folderName}`, result);
            resolve(result);
          } else {
            // console.log(
            //   `No data found for folder: ${folderName} with ID: ${folderId}`
            // );
            resolve(null);
          }
          db.close();
        };

        request.onerror = function (event) {
          console.error(
            `Error retrieving data for folder: ${folderName}`,
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

  //update indexeddb
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
            existingRecord.data = newData || existingRecord.data;
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

  // delete processed data from indexeddb
  async function deleteProcesseddata(id, newFolderName, newData) {
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
            existingRecord.data = newData || existingRecord.data;
            existingRecord.processeddata = null;

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

  // Function to handle deletion of processed data
  const handleDeleteProcessedDataClick = async () => {
    try {
      // Delete processed data and show original files
      await deleteProcesseddata(folder._id, folder.folderName, null);
      toast.success("Processed data deleted successfully!");

      // Refetch original files after deleting processed data
      const updatedPayoutData = await fetchPayoutData(
        folder.folderName,
        folder._id
      );
      if (updatedPayoutData && updatedPayoutData.data) {
        setFiles(updatedPayoutData.data.data);
        setHasProcessedData(false);
      }

      // Clear selected files
      setSelectedFiles([]);
      isOpen && toggleAccordion(); // Close the accordion if it
    } catch (error) {
      console.error("Error deleting processed data:", error);
      toast.error("Failed to delete processed data.");
    }
  };

  // for fetching data from indexeddb

  async function fetchPayoutData(folderName, folderId) {
    try {
      const payoutData = await getPayoutDataFromIndexedDB(folderName, folderId);
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

  async function initializeDatabase() {
    return new Promise((resolve, reject) => {
      const openDB = indexedDB.open("PayoutData", 2);

      openDB.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("Folders")) {
          db.createObjectStore("Folders", { keyPath: "id" });
        }
      };

      openDB.onsuccess = function () {
        // console.log("Database initialized successfully");
        resolve();
      };

      openDB.onerror = function (event) {
        console.error("Database initialization error:", event);
        reject(event);
      };
    });
  }

  // saving data to indexeddb for offline use

  async function cacheExcelFile(folderName, folderId, payoutData) {
    return new Promise((resolve, reject) => {
      const openDB = indexedDB.open("PayoutData");

      openDB.onsuccess = function () {
        const db = openDB.result;
        const tx = db.transaction("Folders", "readwrite");
        const store = tx.objectStore("Folders");

        const request = store.put({
          id: folderId,
          folderName,
          folderId,
          data: payoutData,
          processeddata: null,
        });

        request.onsuccess = function () {
          // console.log(`Data cached for folder: ${folderName}`);
          resolve();
        };

        request.onerror = function (event) {
          console.error(
            `Failed to cache data for folder: ${folderName}`,
            event
          );
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

  const toggleAccordion = useCallback(async () => {
    onToggle(); // Trigger the parent toggle function
    if (!isOpen) {
      setLoadingFiles(true);
      try {
        // console.log("folder", folder);

        // Initialize the database (creates the Folders store if it doesn't exist)
        await initializeDatabase();

        // Fetch data from the Folders store using combined folderName and folderId
        const response = await fetchPayoutData(folder.folderName, folder._id);
        // console.log("Response:", response);

        if (!response) {
          // Fetch from the API if no data is found in IndexedDB
          const apiresponse = await getPayoutData(folder._id);
          // console.log("APIResponse:", apiresponse);

          // Sort the files by month if needed
          const sortedFiles = apiresponse.data.data.sort((a, b) => {
            const dateA = monthStringToDate(a.month);
            const dateB = monthStringToDate(b.month);
            return dateA - dateB;
          });

          // Update your state with sorted files
          setFiles(sortedFiles);
          // console.log("Settings:", apiresponse.data.data.settings);
          setSettings(apiresponse.data.settings);

          // Cache the API data into IndexedDB
          await cacheExcelFile(folder.folderName, folder._id, apiresponse.data);
        } else {
          // If data is found in IndexedDB, use it directly
          // console.log("Response:", response);

          // Sort the files by month if needed
          const sortedFiles = response.data.data.data.sort((a, b) => {
            const dateA = monthStringToDate(a.month);
            const dateB = monthStringToDate(b.month);
            return dateA - dateB;
          });

          if (response.data.processeddata) {
            toast.success("Displaying Processed File");
            setFiles(response.data.processeddata);
            setSettings(response.data.data.settings);
            setHasProcessedData(true); // Set flag to indicate no processed data
          } else {
            // Update your state with sorted files
            toast.success("Displaying Original File");
            setFiles(sortedFiles);
            setSettings(response.data.data.settings);
            setHasProcessedData(false); // Set flag to indicate processed data is present
          }
        }
      } catch (error) {
        console.error("Error fetching payout data:", error);
        toast.error("Error fetching payout data.");
      } finally {
        setLoadingFiles(false); // Files have loaded
      }
    }
  }, [folder._id, folder.folderName, isOpen, onToggle]);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]); // Unselect all
    } else {
      setSelectedFiles(files.map((file) => file._id)); // Select all
    }
  };

  const handleFileSelect = (fileId) => {
    setSelectedFiles((prevSelected) =>
      prevSelected.includes(fileId)
        ? prevSelected.filter((id) => id !== fileId)
        : [...prevSelected, fileId]
    );
  };

  const handleProcessClick = () => {
    if (selectedFiles.length !== files.length) {
      toast.error("Please select all files to proceed.");
      return;
    }
    setIsProgressModalOpen(true);
    setmessage("Starting....");
    onProcessClick(folder.folderName, folder._id); // Process function call
  };

  const handleCloseProgressModal = () => {
    setIsProgressModalOpen(false);
    setmessage("Starting....");
  };

  //if processdata is prsent not to upload data
  // const handleUploadAttempt = () => {
  //   if (hasProcessedData) {
  //     // Show warning or message to the user
  //     toast.error(
  //       "Please delete the processed data before uploading a new file."
  //     );
  //   } else {
  //     onUploadClick(folder._id);
  //     // Trigger re-check for processed data status
  //     handleDataProcessed();
  //   }
  // };

  // useEffect to watch for changes in processedData
  useEffect(() => {
    if (processedData) {
      setFiles(processedData);
      setHasProcessedData(true);
    }
  }, [processedData]);

  return (
    <div className="border-b pb-2 mb-2">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={toggleAccordion}
      >
        <div className=" flex items-center">
          <FiChevronRight
            className={`transform transition-transform duration-300 text-orange-500 ${
              isOpen ? "rotate-90" : ""
            }`}
          />
          {isRenaming ? (
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="border max-w-44 rounded-lg p-1 ml-2"
            />
          ) : (
            <div className="flex my-auto gap-2 ml-2">
              <FaFolder className="m-auto text-orange-500" />
              <h3 className="font-medium text-sm">{folder.folderName}</h3>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 relative">
          {isRenaming ? (
            <FiSave
              onClick={handleSaveRename}
              className="text-white p-1 rounded-md hover:text-gray-300 bg-orange-500 cursor-pointer"
              size={25}
              title="Save"
            />
          ) : (
            <>
              <FiUpload
                size={16}
                // onClick={handleUploadAttempt} // Use the new function
                onClick={() => onUploadClick(folder._id)}
                className="text-orange-500 hover:text-orange-700 cursor-pointer"
                title="Upload"
              />

              <button
                onClick={async () => {
                  await toggleAccordion(folder);
                  await handleSettingModal(folder._id);
                  closeDropdown();
                }}
                className="inline-block transform transition-transform text-orange-500 hover:text-orange-700 duration-300 hover:rotate-180"
                title="Setting"
              >
                <IoSettingsSharp size={16} />
              </button>

              <button
                id="dropdownMenuIconButton"
                onClick={toggleDropdown}
                className="text-orange-500 hover:text-orange-700 cursor-pointer"
                type="button"
              >
                <BsThreeDotsVertical size={16} />
              </button>

              {isDropdownOpen && (
                <div
                  id="dropdownDots"
                  className="z-10 absolute right-0 top-6 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                >
                  <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownMenuIconButton"
                  >
                    <li>
                      <button
                        onClick={() => {
                          onRenameClick(folder);
                          closeDropdown();
                        }}
                        className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Rename
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          onDeleteClick(folder._id);
                          closeDropdown();
                        }}
                        className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-red-500"
                      >
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {isOpen && !isRenaming && (
        <div className="ml-6 w-48">
          {/* Show loading spinner while files are loading */}
          {loadingFiles ? (
            <div className="flex items-center gap-2">
              <FiLoader className="animate-spin text-orange-500" size={16} />
              <span className="text-sm text-gray-500">Loading files...</span>
            </div>
          ) : (
            files.length > 0 && (
              <>
                <div className="flex justify-between mb-2 gap-2 mt-1">
                  {hasProcessedData ? (
                    <>
                      <h4>Files Processed</h4>
                      <button
                        onClick={handleDeleteProcessedDataClick}
                        className="flex text-white gap-1 ml-auto bg-red-700 text-sm rounded-md px-1 py-1 hover:bg-red-600 cursor-pointer"
                        title="Delete Processed Data"
                      >
                        <FiTrash
                          className="m-auto"
                          title="delete process file"
                        />
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Select All Button */}
                      <button
                        onClick={handleSelectAll}
                        className="text-sm text-orange-500 hover:text-orange-700"
                      >
                        {selectedFiles.length === files.length ? (
                          <div className="flex gap-1">
                            <PiSelectionAllFill size={22} />
                            Select All
                          </div>
                        ) : (
                          <div className="flex gap-1">
                            <PiSelectionAllLight size={22} />
                            Select All
                          </div>
                        )}
                      </button>

                      {/* Process Button */}
                      <button
                        onClick={handleProcessClick}
                        className="text-white bg-orange-500 text-sm rounded-md px-1 py-1 hover:text-white cursor-pointer"
                        title="Process"
                      >
                        Process
                      </button>
                    </>
                  )}
                </div>
                {/* Display files */}
                {/* Scrollable file list container */}
                <ul
                  className="max-h-32 overflow-y-auto"
                  style={{
                    scrollbarWidth: "thin", // For Firefox
                  }}
                >
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className={`flex items-center justify-between text-sm mb-1 p-1 rounded-md cursor-pointer transition-all duration-200 ${
                        selectedFiles.includes(file._id)
                          ? "bg-orange-100 dark:bg-orange-800"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() =>
                        onFileClick(file.month, file.data, settings)
                      }
                    >
                      <span className="flex items-center gap-2">
                        {!hasProcessedData && (
                          <input
                            type="checkbox"
                            checked={selectedFiles.includes(file._id)}
                            onChange={() => handleFileSelect(file._id)}
                          />
                        )}
                        <LiaFileSolid size={20} className="text-red-500" />
                        {file.month}
                      </span>

                      {!hasProcessedData && (
                        <FiTrash
                          onClick={() => onFileDeleteClick(file._id)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        />
                      )}
                    </li>
                  ))}
                </ul>

                {/* Show More Button */}
                {files.length > 4 && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="text-sm text-orange-500 hover:text-orange-700"
                    >
                      Show More ({files.length - 4})
                    </button>
                  </div>
                )}
                <FileListModal
                  isOpen={isModalOpen}
                  toggleModal={handleModalToggle}
                  files={files}
                  folderId={folder._id} // Pass folder._id here
                  folderName={folder.folderName}
                  onFileClick={onFileClick}
                  Modalprocess={onProcessClick}
                  onFileDeleteClick={onFileDeleteClick}
                  closeModalAfterProcess={handleModalToggle} // This will close the modal when process starts
                  handleDeleteProcessedDataClick={
                    handleDeleteProcessedDataClick
                  }
                  hasProcessedData={hasProcessedData}
                  setIsProgressModalOpen={setIsProgressModalOpen}
                  settings={settings}
                />
              </>
            )
          )}

          {/* Show no files message if no files are present */}
          {!loadingFiles && files.length === 0 && (
            <div className="text-sm text-gray-500 mt-1">No files uploaded</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Accordion;
