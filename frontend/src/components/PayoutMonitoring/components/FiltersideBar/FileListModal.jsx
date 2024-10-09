import React, { useState, useEffect } from "react";
import { FiTrash } from "react-icons/fi";
import { LiaFileSolid } from "react-icons/lia";
import { PiSelectionAllLight, PiSelectionAllFill } from "react-icons/pi";
import { IoCloseOutline } from "react-icons/io5";

// Month mapping for full month names to abbreviations
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

const FileListModal = ({
  isOpen,
  toggleModal,
  folderId, // Accept folderId as a prop
  files,
  folderName,
  onFileClick,
  Modalprocess,
  onFileDeleteClick,
  closeModalAfterProcess,
  hasProcessedData, // Pass hasProcessedData prop to toggle state
  handleDeleteProcessedDataClick, // Handler to delete processed data
  setIsProgressModalOpen,
  settings
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFiles, setFilteredFiles] = useState(files);
  const [selectedYear, setSelectedYear] = useState("");
  const [allFilesSelected, setAllFilesSelected] = useState(false);

  useEffect(() => {
    // Filter files by search query and year
    const filtered = files.filter((file) => {
      const fileYear = "20" + file.month.split("-")[1];
      const abbreviatedSearchQuery =
        monthMap[searchQuery.toLowerCase()] || searchQuery.toLowerCase();
      return (
        file.month.toLowerCase().includes(abbreviatedSearchQuery) &&
        (!selectedYear || fileYear === selectedYear)
      );
    });

    setFilteredFiles(filtered);
  }, [searchQuery, selectedYear, files]);

  useEffect(() => {
    // Set all files selected or not
    setAllFilesSelected(selectedFiles.length === files.length);
  }, [selectedFiles, files.length]);

  const handleSelectAll = () => {
    if (allFilesSelected) {
      setSelectedFiles([]); // Unselect all
    } else {
      setSelectedFiles(files.map((file) => file._id)); // Select all files
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
    Modalprocess(folderName, folderId);
  };

  const handleProcess = () => {
    if (!allFilesSelected) {
      alert("Please select all files.");
    } else {
      handleProcessClick(); // Trigger the process function
      closeModalAfterProcess(); // Close the modal after processing
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full">
            {/* Header with file count */}
            <div className="flex justify-between items-center rounded-t-lg mb-4 bg-gradient-to-r from-orange-500 to-yellow-500 p-2">
              <h2 className="text-lg font-semibold text-white">
                {folderName} -{" "}
                {hasProcessedData ? "Processed Files" : "All Files"} (
                {filteredFiles.length})
              </h2>
              <button
                onClick={toggleModal}
                className="text-white dark:text-gray-300"
              >
                <IoCloseOutline size={25} />
              </button>
            </div>

            {/* Search Bar and Year Selection */}
            <div className="flex justify-between mb-4 px-5 gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files"
                className="border rounded-lg p-2 text-sm w-2/3"
              />

              {/* Year Selection Input */}
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border rounded-lg p-2 text-sm w-1/3 bg-white dark:bg-gray-700 dark:text-white"
                placeholder="YYYY"
                min="2000"
                max="2099"
              />
            </div>

            {/* Select All or Delete Processed Data Button */}
            <div className="flex justify-between  mb-4 px-6">
              {hasProcessedData ? (
                // Show "Delete Processed Data" button when hasProcessedData is true
                <button
                  onClick={handleDeleteProcessedDataClick}
                  className="text-white bg-red-600 ml-auto   text-sm rounded-md px-2 py-1 hover:bg-red-600 cursor-pointer"
                >
                  Delete Processed Data
                </button>
              ) : (
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-orange-500 hover:text-orange-700"
                >
                  {allFilesSelected ? (
                    <div className="flex gap-1">
                      <PiSelectionAllFill size={22} />
                      Unselect All
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <PiSelectionAllLight size={22} />
                      Select All
                    </div>
                  )}
                </button>
              )}
            </div>

            {/* File List */}
            <ul
              className="max-h-48 overflow-auto mb-4 px-3 scroll-smooth"
              style={{
                scrollbarWidth: "thin", // Firefox
                scrollbarColor: "orange white", // Firefox
              }}
            >
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file, index) => (
                  <li
                    key={index}
                    className={`flex items-center justify-between text-sm mb-2 p-2 rounded-md cursor-pointer border-b-2 border-r-2 border-orange-200 ${
                      selectedFiles.includes(file._id)
                        ? "bg-orange-100 dark:bg-orange-800"
                        : ""
                    }`}
                  >
                    <span
                      className="flex items-center gap-2"
                      onClick={() => onFileClick(file.month, file.data,settings)}
                    >
                      {/* Conditionally hide checkbox if hasProcessedData is true */}
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
                ))
              ) : (
                <div className="text-gray-500 dark:text-gray-300">
                  No files found
                </div>
              )}
            </ul>

            {/* Process Button at Bottom Right */}
            <div className="flex justify-end mt-4 px-2 py-4">
              {!hasProcessedData && (
                <button
                  onClick={handleProcess}
                  className={`${
                    allFilesSelected
                      ? "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                      : "bg-gray-400 cursor-not-allowed"
                  } text-white py-2 px-4 rounded-lg focus:ring-2 focus:ring-orange-400`}
                >
                  {allFilesSelected ? "Process" : "Please select all files"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileListModal;
