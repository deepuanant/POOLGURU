import React, { useState, useEffect } from "react";
import CircularModal from "./CicularModal";
import Notification from "./Notificationmodal";
import { getNotifications, getcircularofuser } from "../../api/userapi";

const NotificationModel = ({ unreadnot, unreadcir, updatenot, updatecir }) => {
  // console.log("unreadnot", unreadnot, "unreadcir", unreadcir);
  const [activeTab, setActiveTab] = useState("All");
  const [circularmessage, setCircularMessage] = useState([]);
  const [notificationmessage, setNotificationMessage] = useState([]);

  useEffect(() => {
    const fetchCirculars = async () => {
      try {
        const response = await getcircularofuser();
        if (response.status === 200) {
          const data = response.data.result.reverse();
          setCircularMessage(data);
        } else {
          console.error("Failed to fetch circulars");
        }
      } catch (err) {
        console.error("Error fetching circulars: ", err.message);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        if (response.status === 200) {
          const data = response.data.result.reverse();
          setNotificationMessage(data);
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (err) {
        console.error("Error fetching notifications: ", err.message);
      }
    };

    fetchCirculars();
    fetchNotifications();
  }, []);

  const renderModal = () => {
    switch (activeTab) {
      case "Circular":
        return (
          <CircularModal
            message={circularmessage}
            count={unreadcir}
            updatecount={updatecir}
          />
        );
      case "Notification":
        return (
          <Notification
            message={notificationmessage}
            count={unreadnot}
            updatecount={updatenot}
          />
        );
      case "All":
        return (
          <>
            <div>
              <h3 className="mb-0 text-xs font-bold ms-2">Circulars</h3>
              <CircularModal
                message={circularmessage}
                count={unreadcir}
                updatecount={updatecir}
              />
            </div>
            <div className="mt-2">
              <h3 className="mb-0 text-xs font-bold ms-2">Notifications</h3>
              <Notification
                message={notificationmessage}
                count={unreadnot}
                updatecount={updatenot}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="sm:hidden">
        <div className="flex justify-between mb-3 tabs">
          {["All", "Notification", "Circular"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center relative ${
                activeTab === tab ? "border-b-2 border-blue-500" : ""
              }`}
            >
              {tab}
              {tab === "Notification" && unreadnot > 0 && (
                <div className="absolute flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -right-1">
                  {unreadnot}
                </div>
              )}
              {tab === "Circular" && unreadcir > 0 && (
                <div className="absolute flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -right-1">
                  {unreadcir}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden sm:block">
        <div className="flex justify-between mb-3 tabs" data-tabs="true">
          {["All", "Notification", "Circular"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center relative ${
                activeTab === tab ? "border-b-2 border-blue-500" : ""
              }`}
              data-tab-toggle={`#tab_${tab}`}
            >
              {tab}
              {tab === "Notification" && unreadnot > 0 && (
                <div className="absolute flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -right-1">
                  {unreadnot}
                </div>
              )}
              {tab === "Circular" && unreadcir > 0 && (
                <div className="absolute flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -right-1">
                  {unreadcir}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>{renderModal()}</div>
    </div>
  );
};

export default NotificationModel;
