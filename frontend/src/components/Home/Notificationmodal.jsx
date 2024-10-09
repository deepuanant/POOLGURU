import React, { useEffect, useState } from "react";
import { markread } from "../../api/userapi"; // Assuming you have a similar API for notifications

export function NotificationModal({ message, count, updatecount }) {
  const [notifications, setNotifications] = useState([]);
  // console.log("message", message, "count", count);
  useEffect(() => {
    // Filter messages that are unread (readtime is null) or read within the last 24 hours
    const filteredMessages = message.filter((mes) => {
      return (
        !mes.readtime ||
        Date.now() - new Date(mes.readtime).getTime() <= 24 * 60 * 60 * 1000
      );
    });

    setNotifications(filteredMessages);

    // Mark notifications as read when count > 0
    const markRead = async () => {
      try {
        const response = await markread();
        if (response.status === 200) {
          updatecount();
        } else {
          console.error("Failed to mark notifications as read");
        }
      } catch (err) {
        console.error("Error marking notifications read: ", err.message);
      }
    };

    if (count > 0) {
      markRead();
    }
  }, [message, count, updatecount]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <ul className="space-y-2 max-h-[320px] pr-2 overflow-y-auto relative">
        {notifications.length > 0 ? (
          notifications.map((item, index) => (
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
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="p-2 bg-gradient-to-r from-orange-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-md">
            <div className="flex items-center justify-center w-full">
              <p className="text-center text-sm text-gray-700 dark:text-gray-300">
                No notifications available
              </p>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}

export default NotificationModal;
