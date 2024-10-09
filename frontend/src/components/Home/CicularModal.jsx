import React, { useEffect, useState } from "react";
import { markcircularread } from "../../api/userapi";
import { FaDownload } from "react-icons/fa";

// Correct the function signature to accept props as an object
export function CircularModal({ message, count, updatecount }) {
  const [circular, setCircular] = useState([]);

  // console.log("message", message, "count", count);

  useEffect(() => {
    // Filter messages and set the state inside useEffect
    const filteredMessages = message
      .filter((mes) => {
        // Check if readtime is null or within the last 24 hours
        return (
          !mes.readtime ||
          Date.now() - new Date(mes.readtime).getTime() <= 24 * 60 * 60 * 1000
        );
      })
      .sort((a, b) => {
        // Sort messages by 'date' field in descending order (latest date on top)
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });

    setCircular(filteredMessages);

    const markread = async () => {
      try {
        const response = await markcircularread();
        if (response.status === 200) {
          updatecount();
        } else {
          console.error("Failed to mark circulars read");
        }
      } catch (err) {
        console.error("Error marking circulars read: ", err.message);
      }
    };

    if (count > 0) {
      markread();
    }
  }, [message, count, updatecount]); // Added dependencies to useEffect

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <ul className="space-y-2 max-h-[320px] pr-2 overflow-y-auto relative">
        {circular.length > 0 ? (
          circular.map((item, index) => (
            <li
              key={index}
              className="p-2 bg-gradient-to-r from-orange-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start space-x-2 rtl:space-x-reverse">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate dark:text-white">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                    {item.message}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <div className="flex gap-1">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 dark:text-orange-400 hover:underline z-10 text-xs"
                      >
                        Know more
                      </a>
                    )}
                    {item.pdfurl && (
                      <a
                        href={item.pdfurl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 dark:text-orange-400 hover:underline z-10"
                      >
                        <FaDownload className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(item.date ? item.date : item.createdAt)}
                  </span>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="p-2 bg-gradient-to-r from-orange-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-md">
            <div className="flex items-center justify-center w-full">
              <p className="text-center text-sm text-gray-700 dark:text-gray-300">
                No circulars available
              </p>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}

export default CircularModal;
