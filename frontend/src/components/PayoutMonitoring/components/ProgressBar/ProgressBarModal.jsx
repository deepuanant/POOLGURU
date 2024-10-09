import React, { useState, useEffect } from "react";
import { MdCancel } from "react-icons/md";

const ProgressBarModal = ({ show, onClose, message }) => {
  const [progress, setProgress] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(message);
  const [timerInterval, setTimerInterval] = useState(null);

  // Define a mapping between messages and progress percentages
  const progressMap = {
    "Starting....": 10,
    "Checking for missing months...": 15,
    "No missing months found, proceeding...": 20,
    "Sorting files by month...": 25,
    "Processing each file...": 30,
    "Processing file for month 1": 35,
    "Processing file for month 2": 40,
    "Processing file for month 3": 45,
    "Extracting month from uploaded data...": 46,
    "Processing previous data...": 48,
    "Copying overdue data for month 1...": 50,
    "Copying overdue data for month 2...": 54,
    "Copying overdue data for month 3...": 58,
    "Copying closing overdue data...": 62,
    "Adding current month columns...": 64,
    "Calculating net collection...": 66,
    "Calculating current interest...": 68,
    "Calculating closing overdues...": 70,
    "Calculating overdues...": 72,
    "Calculating ISR...": 74,
    "Calculating assignee principal share...": 76,
    "Calculating assignee interest share...": 78,
    "Calculating assignee closing balance...": 80,
    "Calculating assignee principal overdue...": 82,
    "Calculating assignee interest overdue...": 84,
    "Calculating closing balance...": 86,
    "Calculating advance...": 88,
    "Calculating arrear days...": 90,
    "Finalizing NPA classification...": 92,
    "Processing completed successfully": 95,
    "Creating batch...": 96,
    "Batch created successfully": 97,
    "Uploading processed data...": 98,
    "Report Generated Successfully": 99,
    "Done": 100,
    "Error creating batch": 100, // Add error message to close the modal
  };

  useEffect(() => {
    // Set progress based on the message using the mapping
    if (progressMap[currentMessage] !== undefined) {
      setProgress(progressMap[currentMessage]);
    }

    if (currentMessage === "Done" || currentMessage === "Error creating batch") {
      setProgress(100); // Set progress to 100% when the message is "Done" or "Error"
      // Close the modal after 2 to 3 seconds
      const closeTimeout = setTimeout(() => {
        onClose();
      }, 2500); // 2500ms = 2.5 seconds

      return () => {
        clearTimeout(closeTimeout); // Clear the timeout if the component unmounts
      };
    }

    // Time tracking
    if (show && !timerInterval) {
      const interval = setInterval(() => {
        setTimeElapsed((currentTime) => {
          if (currentTime < 40000) {
            return currentTime + 1000;
          } else {
            clearInterval(interval);
            return currentTime;
          }
        });
      }, 1000);
      setTimerInterval(interval);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    };
  }, [currentMessage, onClose, show, timerInterval]);

  useEffect(() => {
    if (show) {
      setCurrentMessage(message);
    } else {
      setCurrentMessage("Starting....");
      setProgress(10);
      setTimeElapsed(0);
    }
  }, [show, message]);

  const percentage = progress;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-10 ${
        show ? "block" : "hidden"
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">Progress</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-all duration-200 text-2xl"
          >
            <MdCancel />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="relative pt-1">
            {/* Progress Bar */}
            <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-orange-200">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-500 relative"
              >
                {/* Percentage text overlay on progress bar */}
                <span className="absolute inset-0 flex justify-center items-center text-black text-sm font-semibold">
                  {percentage}%
                </span>
              </div>
            </div>

            {/* Status and Timer */}
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <div>{currentMessage}</div>
              <div>{timeElapsed / 1000}s elapsed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBarModal;
