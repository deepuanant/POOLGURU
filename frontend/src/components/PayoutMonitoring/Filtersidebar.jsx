import * as XLSX from "xlsx";
import React, { useState, useRef, useEffect } from "react";
import { FiX, FiLoader } from "react-icons/fi";
import ProgressBarModal from "./components/ProgressBar/ProgressBarModal.jsx";
import UploadExcel from "./ExcelUtility/uploadexcel";
import BatchesHistory from "./components/Batches/BatchHistory.jsx";
import LoadingSpinner from "../Home/Loadingspinner.jsx";
import {
  getPayoutData,
  uploadPayoutData,
  createFolder,
  getFolders,
  deleteFolderById,
  updateFolderById,
  uploadProcessedData,
} from "../../api/servicesapi";
import { Link } from "react-router-dom";
import Accordion from "./components/FiltersideBar/Accordion.jsx";
import toast from "react-hot-toast";
import { processXlsx } from "./ExcelUtility/ProcessExcel";
import SettingModal from "./components/Settings/SettingModal.jsx";
import { distributionData } from "./ExcelUtility/CollectionDistributon/Main.js";
import { MdCreateNewFolder } from "react-icons/md";
import { handleCreateBatch } from "../../utils/batchUtils.jsx";

// Helper function to convert month string to Date object
const monthStringToDate = (monthString) => {
  const [month, year] = monthString.split("-");
  const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
  return new Date(year, monthIndex);
};

// Filter Sidebar Component
const FilterSidebar = ({
  onDownloadClick,
  setData,
  setProccessedData,
  setMonth,
  setExportData,
  isOpen,
  toggleSidebar,
  processedData,
}) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isModalOpenBatches, setIsModalOpenBatches] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [currentFolderIdForSettings, setCurrentFolderIdForSettings] =
    useState(null);

  const [newFolderName, setNewFolderName] = useState("");
  const [settingModal, setSettingModal] = useState(false);
  const [showOptions, setShowOptions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadstate, setUploadstate] = useState(false);
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [message, setmessage] = useState("Starting....");
  const [Message, setMessage] = useState("Uploading...");
  const [folders, setFolders] = useState([]);
  const [payoutData, setPayoutData] = useState({});
  const fileInputRef = useRef();
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [openFolderId, setOpenFolderId] = useState(null); // Track which accordion is open

  const user = { id: 1 }; // Replace with actual user data

  // Function to handle toggling accordion open/close
  const handleAccordionToggle = (folderId) => {
    setOpenFolderId(openFolderId === folderId ? null : folderId); // Open clicked accordion or close if already open
  };

  // Fetch folders when component mounts or user ID changes

  useEffect(() => {
    const fetchFolders = async () => {
      setLoadingFolders(true);
      try {
        const response = await getFolders(user.id);
        if (response && response.status === 200) {
          // console.log("response for fetching folder", response);
          setFolders(response.data);
        } else {
          toast.error("Failed to fetch folders.");
        }
      } catch (error) {
        console.error("Error fetching folders:", error);
        toast.error("Error fetching folders.");
      } finally {
        setLoadingFolders(false);
      }
    };
    fetchFolders();
  }, []);

  useEffect(() => {
    if (uploadstate && currentFolderId) {
      // Re-fetch the specific updated folder to reflect the new uploaded file
      const fetchUpdatedFolder = async () => {
        try {
          const response = await getFolders(currentFolderId); // Fetch by folder ID
          if (response && response.status === 200) {
            // console.log("Updated folder after upload:", response);

            // Update only the specific folder in the state
            setFolders((prevFolders) =>
              prevFolders.map((folder) =>
                folder._id === currentFolderId ? response.data : folder
              )
            );
          } else {
            toast.error("Failed to fetch updated folder.");
          }
        } catch (error) {
          console.error("Error fetching updated folder:", error);
          toast.error("Error fetching updated folder.");
        }
      };

      fetchUpdatedFolder();

      // Reset the upload state after fetching the updated folder
      setUploadstate(false);
    }
  }, [uploadstate, currentFolderId]);

  // creating new folder
  const handleCreateFolder = async () => {
    if (!folderName) {
      toast.error("Folder name cannot be empty.");
      return;
    }

    try {
      const response = await createFolder(folderName, user.id);
      if (response && response.status === 201) {
        toast.success("Folder created successfully!");

        setFolders([...folders, response.data.folder]);
        // console.log("New folder created", response.data.folder);
        setFolderName("");
      } else {
        toast.error("Failed to create folder.");
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Error creating folder.");
    }
  };
  // for renaming folder
  const handleSaveRename = async () => {
    if (!newFolderName) {
      toast.error("Folder name cannot be empty.");
      return;
    }

    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const response = await updateFolderById(editingFolderId, {
            folderName: newFolderName,
          });

          if (response && response.status === 200) {
            await updateFolderData(editingFolderId, newFolderName, null, null);

            setFolders((prevFolders) =>
              prevFolders.map((folder) =>
                folder._id === editingFolderId
                  ? { ...folder, folderName: newFolderName }
                  : folder
              )
            );
            setEditingFolderId(null);
            setNewFolderName("");
            resolve("Folder renamed successfully!");
          } else {
            reject(new Error("Failed to rename folder."));
          }
        } catch (error) {
          console.error("Error renaming folder:", error);
          reject(new Error(error.response.data.message));
        }
      }),
      {
        loading: "Renaming folder...",
        success: "Folder renamed successfully!",
        error: (err) => `${err.message}`,
      }
    );
  };

  // delete folder

  const handleDeleteFolder = async (folderId) => {
    try {
      await deleteFolderById(folderId);
      await deletePayoutEntryIfExists(folderId);
      setFolders((prevFolders) =>
        prevFolders.filter((folder) => folder._id !== folderId)
      );
      toast.success("Folder deleted successfully!");
    } catch (error) {
      console.error("Error deleting folder:", error);
      toast.error("Failed to delete folder.");
    }
  };

  // uploading raw file to database

  const handleFileUpload = async (file) => {
    if (!currentFolderId) {
      toast.error("Please select a folder to upload the file.");
      return;
    }
    setUploadedFile(file);
    setIsUploading(true);
    const loadingToastId = toast.loading("Uploading file, please wait...");
    try {
      const uploadedSheetData = await file.arrayBuffer();
      const workbook = XLSX.read(uploadedSheetData, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const uploadedData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        raw: false,
      });

      if (!uploadedData || uploadedData.length === 0) {
        toast.error("Uploaded sheet is empty.");
        toast.dismiss(loadingToastId);
        return;
      }
      const monthIndex = uploadedData[0].indexOf("Collection Month");
      const actualMonth = uploadedData[2][monthIndex];
      const datatoupload = { month: actualMonth, data: uploadedData };
      // Check if the folder exists in IndexedDB
      const res = await uploadPayoutData(currentFolderId, datatoupload);
      if (res && res.status === 201) {
        // console.log("Data uploaded successfully:", res);

        // Save the uploaded data to IndexedDB
        await saveUploadPayOutData(
          currentFolderId,
          null,
          res.data.remainingPayoutData,
          null
        );

        setMessage(`Data uploaded successfully for month "${actualMonth}"!`);

        // Update the payout data state with the uploaded data
        setPayoutData((prevState) => ({
          ...prevState,
          [currentFolderId]: datatoupload.data,
        }));

        // Ensure the folder state is updated to trigger a re-render
        setFolders((prevFolders) =>
          prevFolders.map((folder) =>
            folder._id === currentFolderId
              ? { ...folder, data: [...(folder.data || []), datatoupload] }
              : folder
          )
        );

        setUploadstate(true);
      } else {
        toast.error(`Failed to upload data to folder "${currentFolderId}".`);
      }
    } catch (error) {
      console.error("Error uploading or saving data:", error);
      toast.error("Failed to upload and save the data.");
    } finally {
      toast.dismiss(loadingToastId);
      setIsUploading(false);
      setUploadstate(false); // Optionally reset the upload state if necessary
    }
  };

  // Function to check if a folder exists in IndexedDB

  const handleUploadClick = (folderId) => {
    setCurrentFolderId(folderId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processfile = async (sheetsData, settings) => {
    let previousOutput = [];
    try {
      for (let i = 0; i < sheetsData.length; i++) {
        const currentMonthData = sheetsData[i];
        setmessage(`Processing file for month ${i + 1}`);
        const processedResult = await distributionData(
          currentMonthData,
          JSON.parse(JSON.stringify(previousOutput)),
          settings,
          setmessage
        );
        const currentMonthOutput = processedResult.data;
        previousOutput.push(currentMonthOutput);
        setmessage(`Processed output for month ${i + 1}`);
      }
      return previousOutput;
    } catch (error) {
      // console.log("Error processing months:", error);
      throw error;
    }
  };

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
            resolve(result.data);
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

  // Save the uploaded payout data to IndexedDB
  async function saveUploadPayOutData(
    id,
    newFolderName,
    newData,
    processeddata
  ) {
    return new Promise(async (resolve, reject) => {
      // Check if the PayoutData database exists
      const databases = await indexedDB.databases();
      const dbExists = databases.some((db) => db.name === "PayoutData");

      // If the database doesn't exist, do nothing
      if (!dbExists) {
        // console.log("PayoutData database does not exist. No action taken.");
        resolve();
        return;
      }

      // Proceed with opening the existing PayoutData database
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
            existingRecord.data.data = newData || existingRecord.data.data;
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

  //update the indexeddb

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

  // for fetching data from indexeddb

  async function fetchPayoutData(folderName, folderId) {
    try {
      const payoutData = await getPayoutDataFromIndexedDB(folderName, folderId);
      // console.log(folderName, folderId);
      if (payoutData) {
        console.log("Payout data:", payoutData);
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

  const handleProcessClick = async (folderName, folderId) => {
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          // setIsProgressModalOpen(true);
          const response = await fetchPayoutData(folderName, folderId);

          setmessage("Extracting months and years from file names...");
          const files = response.data.data || [];
          const monthsMap = {
            jan: 0,
            feb: 1,
            mar: 2,
            apr: 3,
            may: 4,
            jun: 5,
            jul: 6,
            aug: 7,
            sep: 8,
            oct: 9,
            nov: 10,
            dec: 11,
          };

          // Parse the files to extract month and year
          const parsedFiles = files.map((file) => {
            const [monthPart, yearPart] = file.month.split("-");
            const monthIndex = monthsMap[monthPart.toLowerCase()];
            const year = parseInt("20" + yearPart, 10);
            return { month: monthIndex, year };
          });

          // Sort the files by year and month
          setmessage("Sorting files by year and month...");
          parsedFiles.sort((a, b) => a.year - b.year || a.month - b.month);

          // Check for missing months
          setmessage("Checking for missing months...");
          let missingMonths = [];
          for (let i = 1; i < parsedFiles.length; i++) {
            const prev = parsedFiles[i - 1];
            const current = parsedFiles[i];

            const diffInMonths =
              (current.year - prev.year) * 12 + (current.month - prev.month);

            if (diffInMonths > 1) {
              for (let j = 1; j < diffInMonths; j++) {
                const missingMonthIndex = (prev.month + j) % 12;
                const missingYear =
                  prev.year + Math.floor((prev.month + j) / 12);

                const missingMonthName = Object.keys(monthsMap).find(
                  (key) => monthsMap[key] === missingMonthIndex
                );
                const missingMonthFormatted = `${missingMonthName}-${String(
                  missingYear
                ).slice(-2)}`;
                missingMonths.push(missingMonthFormatted);
              }
            }
          }

          // If any month is missing, reject and exit early
          if (missingMonths.length > 0) {
            setmessage(
              `Missing month(s): ${missingMonths.join(
                ", "
              )}. Please upload these files.`
            );
            setIsProgressModalOpen(false);
            reject(
              new Error(
                `Missing month(s): ${missingMonths.join(
                  ", "
                )}. Please upload these files.`
              )
            );
            return;
          } else {
            setmessage("No missing months found, proceeding...");
          }

          // Proceed with processing if no missing months are found
          setmessage("Sorting files by month...");
          const sortedFiles = (response.data.data || []).sort((a, b) => {
            const dateA = monthStringToDate(a.month);
            const dateB = monthStringToDate(b.month);
            return dateA - dateB;
          });

          // console.log("response for process", response.data);

          setmessage("Processing each file...");
          if (
            response.data.settings &&
            response.data.settings.dealName !== null &&
            response.data.settings.assignor !== null &&
            response.data.settings.assignees !== null &&
            response.data.settings.dateofDisbursement !== null &&
            response.data.settings.noOfObligors !== null &&
            response.data.settings.disbursedAmount !== null &&
            response.data.settings.assignorShare !== null &&
            response.data.settings.assigneeShare !== null
          ) {
            // console.log("Settings found:", response.data.settings);
            const processdata = await processfile(
              sortedFiles,
              response.data.settings
            );

            if (processdata) {
              // Update folder data only after successful processing
              await updateFolderData(folderId, null, null, processdata);
              await setProccessedData(processdata);
              setmessage("Processing completed successfully");
              const length = processdata.length;
              const lastMonthData = processdata[length - 1];
              await onclickpayoudata(
                lastMonthData.month,
                lastMonthData.data,
                lastMonthData.settings
              );

              // Proceed with batch creation and final steps
              setmessage("Processing batch...");
              const batchProcessedOrNot = processdata ? "success" : "failed";
              let ExportReportStatus = "pending";

              if (batchProcessedOrNot === "success") {
                ExportReportStatus = "success";
              }

              setmessage("Creating batch...");
              await handleCreateBatch(
                user.id,
                "success",
                batchProcessedOrNot,
                ExportReportStatus
              );

              setmessage("Batch created successfully");

              setmessage("Uploading processed data...");

              setmessage("Report Generated Successfully");
              setmessage("Done");

              // console.log("Processed data:", processdata);
            } else {
              reject(new Error("Error processing data"));
              return;
            }
          } else {
            toast.error("Settings not found");
            setmessage("Settings not found");
            setIsProgressModalOpen(false);
            reject(new Error("Settings not found"));
            return;
          }
          resolve("Processing completed successfully.");
        } catch (error) {
          // Handle only real errors here
          setmessage("Error creating batch");
          await handleCreateBatch(user.id, "success", "failed");
          console.error("Error processing payout data:", error);
          setIsProgressModalOpen(false);
          reject(new Error("Error processing payout data"));
        }
      }),
      {
        loading: "Processing payout data...",
        success: "Processing completed successfully!",
        error: (error) => `${error.message}`,
      }
    );
  };

  const toggleOptions = (folderId) => {
    setShowOptions(showOptions === folderId ? null : folderId);
  };

  const onRenameClick = (folder) => {
    setEditingFolderId(folder._id);
    setNewFolderName(folder.folderName);
  };

  async function deletePayoutEntryIfExists(key) {
    return new Promise((resolve, reject) => {
      // Open the database
      const openDB = indexedDB.open("PayoutData");

      openDB.onsuccess = function () {
        const db = openDB.result;
        const tx = db.transaction("Folders", "readwrite");
        const store = tx.objectStore("Folders");

        // First check if the key exists
        const getRequest = store.get(key);

        getRequest.onsuccess = function (event) {
          const result = event.target.result;

          if (result) {
            // If key exists, proceed with deletion
            const deleteRequest = store.delete(key);

            deleteRequest.onsuccess = function () {
              // console.log(`Entry with key ${key} deleted successfully.`);
              resolve();
            };

            deleteRequest.onerror = function (event) {
              console.error(`Error deleting entry with key ${key}:`, event);
              reject(event);
            };
          } else {
            // If key does not exist, resolve without deleting
            // console.log(`No entry found with key ${key}.`);
            resolve();
          }
        };

        getRequest.onerror = function (event) {
          console.error(`Error retrieving entry with key ${key}:`, event);
          reject(event);
        };

        tx.oncomplete = function () {
          db.close();
        };
      };

      openDB.onerror = function (event) {
        console.error("Error opening PayoutData database:", event);
        reject(event);
      };
    });
  }

  const ontemplateclick = async () => {
    const wb = XLSX.utils.book_new();

    const row1 = [
      "Deal Name",
      "Proposal No",
      "Collection Month",
      "Current Payout Date",
      "Rate of Interest",
      "Opening POS (Incl Principle Overdue) (100%)",
      "Customer Billing",
      "Billing Principal",
      "Billing Interest",
      "Billing Prepayment",
      "Charges",
      "Customer Collections",
    ];
    const row2 = [
      "ABCD-1",
      "LAP0564200000005001700",
      "May-24",
      "15-Jun-24",
      "9.20%",
      1234235,
      23415,
      3453,
      3627,
      0,
      0,
      21617,
    ];

    const wsData = [row1, row2];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, "PayoutTemplate.xlsx");
  };

  const onclickpayoudata = async (month, data, settings) => {
    try {
      const metrics = await processXlsx(data, settings);
      setData(metrics);
      setMonth(month);
      setExportData(data);
    } catch (error) {
      console.log("Error in processing payout data", error);
    }
  };

  const handleSettingModal = (folderId) => {
    setCurrentFolderIdForSettings(folderId);
    setSettingModal(true);
  };

  return (
    <>
      <div>
        {/* Other components and code */}

        {isUploading && <LoadingSpinner message={Message} />}

        {/* Remaining components */}
      </div>
      {isOpen && (
        <div
          className="sidebar-container lg:sticky fixed top-13 lg:top-0   lg:max-h-screen min-h-screen bg-white shadow-xl border-gradient-to-r from-orange-500 to-yellow-500 z-20 flex flex-col"
          style={{ width: "270px" }}
        >
          <div className="flex flex-col flex-grow max-h-screen px-4 py-2 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between mt-4">
              <Link
                onClick={() => setIsModalOpenBatches(true)}
                className="text-sm font-medium text-orange-500 underline transition duration-300 hover:text-orange-600 cursor-pointer"
              >
                Batches History
              </Link>
              <button
                onClick={async () => await ontemplateclick()}
                className="flex-1 text-orange-500  border-orange-400 hover:text-orange-600 font-medium text-sm dark:text-orange-400 dark:hover:text-orange-500 transition duration-300 cursor-pointer"
              >
                Template
              </button>
              <button
                type="button"
                onClick={toggleSidebar}
                className="text-orange-500 hover:text-orange-400 duration-300 focus:outline-none transition-transform transform hover:scale-110 sm:block md:block lg:hidden"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4 flex-grow">
              <div className="mt-4">
                <div className="relative ">
                  <div className="">
                    <input
                      type="text"
                      value={folderName}
                      onChange={(e) => setFolderName(e.target.value)}
                      className="block w-full p-3  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Deal name"
                      required
                    />
                    <button
                      onClick={handleCreateFolder}
                      className="text-white absolute  end-2 bottom-1.5 p-2 rounded-lg  bg-gradient-to-r from-orange-500 to-yellow-500"
                    >
                      <MdCreateNewFolder />
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="mt-4 overflow-y-auto max-h-[75vh] no-scrollbar"
                style={{
                  scrollbarWidth: "thin", // For Firefox
                }}
              >
                {loadingFolders ? (
                  <div className="flex items-center justify-center">
                    <FiLoader
                      className="animate-spin text-orange-500"
                      size={24}
                    />
                    <span className="ml-2 text-orange-500">
                      Fetching folders...
                    </span>
                  </div>
                ) : (
                  folders.map((folder, index) => (
                    <Accordion
                      key={index}
                      folder={folder}
                      payoutData={(payoutData && payoutData[folder._id]) || []}
                      onUploadClick={handleUploadClick}
                      onProcessClick={handleProcessClick}
                      onRenameClick={onRenameClick}
                      onDeleteClick={handleDeleteFolder}
                      onFileClick={onclickpayoudata}
                      isRenaming={editingFolderId === folder._id}
                      setNewFolderName={setNewFolderName}
                      newFolderName={newFolderName}
                      handleSaveRename={handleSaveRename}
                      showOptions={showOptions}
                      toggleOptions={toggleOptions}
                      handleSettingModal={handleSettingModal}
                      message={message}
                      setmessage={setmessage}
                      processedData={processedData}
                      setIsProgressModalOpen={setIsProgressModalOpen}
                      isOpen={openFolderId === folder._id} // Pass accordion-specific open state
                      onToggle={() => handleAccordionToggle(folder._id)} // Pass toggle function
                    />
                  ))
                )}
              </div>
            </div>

            <UploadExcel
              ref={fileInputRef}
              handleFileUpload={handleFileUpload}
              setData={setData}
            />
          </div>
        </div>
      )}
      <BatchesHistory
        isOpen={isModalOpenBatches}
        onClose={() => setIsModalOpenBatches(false)}
      />
      <SettingModal
        isOpen={settingModal}
        onClose={() => setSettingModal(false)}
        folderId={currentFolderIdForSettings}
      />
      <ProgressBarModal
        show={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        message={message}
      />
    </>
  );
};

export default FilterSidebar;
