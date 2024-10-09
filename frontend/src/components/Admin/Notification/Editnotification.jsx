import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NotificationModal from "./NotificationModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import ScrollToTopButton from "../../miscellaneous/ScrollToTopButton";
import {
  getallNotifications,
  updateNotification,
  deleteNotification,
} from "../../../api/adminapi";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const PAGE_SIZE = 5;

function NotificationFeed() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getallNotifications();
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [showUpdateModal, showDeleteModal]);

  const handleUpdateClick = (notification) => {
    setSelectedNotification(notification);
    setShowUpdateModal(true);
  };

  const handleDeleteClick = (notification) => {
    setSelectedNotification(notification);
    setShowDeleteModal(true);
  };

  const handleUpdate = async (updatedNotification) => {
    try {
      const response = await updateNotification(
        updatedNotification._id,
        updatedNotification
      );
      if (response.status === 200) {
        setNotifications(
          notifications.map((notif) =>
            notif._id === updatedNotification._id ? updatedNotification : notif
          )
        );
        setShowUpdateModal(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      }
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteNotification(selectedNotification._id);
      if (response.status === 200) {
        setNotifications(
          notifications.filter(
            (notif) => notif._id !== selectedNotification._id
          )
        );
        setShowDeleteModal(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      }
    }
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedNotification(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedNotification(null);
  };

  const filteredNotifications = notifications.filter((notification) => {
    return true; // For "All"
  });

  const displayedNotifications =
    currentPage === 1
      ? filteredNotifications.slice(0, PAGE_SIZE)
      : filteredNotifications.slice(
          (currentPage - 1) * PAGE_SIZE,
          currentPage * PAGE_SIZE
        );

  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(filteredNotifications.length / PAGE_SIZE)
    ) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 lg:p-12">
      {/* Page Header */}
      <h3 className="mb-6 text-2xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
        Notifications Feed
      </h3>

      {/* Notifications Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-xs md:text-sm">
              <th className="py-3 px-6 text-left">S.No</th>
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Message</th>
              <th className="py-3 px-6 text-left">Date/Time</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-xs md:text-sm font-light">
            {displayedNotifications.length > 0 ? (
              displayedNotifications
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((notification, index) => {
                  const notificationDate = new Date(notification.createdAt);
                  const today = new Date();
                  const isToday =
                    notificationDate.toDateString() === today.toDateString();

                  return (
                    <tr
                      key={notification._id}
                      className={`border-b border-gray-200 hover:bg-gray-100 cursor-pointer ${
                        notification.read ? "bg-white" : "bg-gray-200"
                      }`}
                    >
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        {index + 1 + (currentPage - 1) * PAGE_SIZE}
                      </td>
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        {notification.title}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {notification.message}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {isToday
                          ? notificationDate.toLocaleTimeString()
                          : `${notificationDate.toLocaleDateString()} ${notificationDate.toLocaleTimeString()}`}
                      </td>
                      <td className="py-3 px-6 text-left">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateClick(notification)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(notification)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-3">
                  No notifications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <nav aria-label="Page navigation">
          <ul className="inline-flex space-x-1 text-xs md:text-base">
            <li>
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
                className={`flex items-center justify-center px-4 h-8 md:h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-100 hover:text-gray-700 ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Previous
              </Link>
            </li>
            {Array.from(
              { length: Math.ceil(filteredNotifications.length / PAGE_SIZE) },
              (_, pageIndex) => (
                <li key={pageIndex}>
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pageIndex + 1);
                    }}
                    className={`flex items-center justify-center px-4 h-8 md:h-10 leading-tight ${
                      currentPage === pageIndex + 1
                        ? "text-orange-500 bg-orange-50 border-orange-500"
                        : "text-gray-500 bg-white border-gray-300"
                    } border hover:bg-gray-100 hover:text-gray-700`}
                  >
                    {pageIndex + 1}
                  </Link>
                </li>
              )
            )}
            <li>
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
                className={`flex items-center justify-center px-4 h-8 md:h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-100 hover:text-gray-700 ${
                  currentPage ===
                  Math.ceil(filteredNotifications.length / PAGE_SIZE)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Next
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <NotificationModal
          notification={selectedNotification}
          onClose={handleCloseUpdateModal}
          onSave={handleUpdate}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          onClose={handleCloseDeleteModal}
          onConfirm={handleDelete}
        />
      )}

      <ScrollToTopButton />
    </div>
  );
}

export default NotificationFeed;
