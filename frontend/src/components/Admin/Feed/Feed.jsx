import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScrollToTopButton from "../../miscellaneous/ScrollToTopButton";
import MessageModal from "./MessageModal";
import { fetchMessages, updateseenstatus } from "../../../api/adminapi";

const PAGE_SIZE = 5;

function Feed() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await fetchMessages();
        setMessages(response.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    getMessages();
  }, [showModal]);

  const handleRowClick = async (message) => {
    try {
      const response = await updateseenstatus(message._id);
      if (response.status === 200) {
        setSelectedMessage(message);
        setShowModal(true);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      }
    }
  };

  const markread = async (message) => {
    const id = message._id;
    const seenstatus = !message.seenstatus;

    try {
      const response = await updateseenstatus(id, seenstatus);
      if (response.status === 200) {
        setMessages(
          messages.map((msg) =>
            msg._id === id ? { ...msg, seenstatus: !msg.seenstatus } : msg
          )
        );
        alert(response.data.message);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
  };

  const filteredMessages = messages.filter((message) => {
    if (filter === "Seen") return message.seenstatus;
    if (filter === "Unseen") return !message.seenstatus;
    return true; // For "All"
  });

  const displayedMessages =
    currentPage === 1
      ? filteredMessages.slice(0, PAGE_SIZE)
      : filteredMessages.slice(
          PAGE_SIZE * (currentPage - 1),
          PAGE_SIZE * currentPage
        );

  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(filteredMessages.length / PAGE_SIZE)
    ) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 lg:p-5">
      {/* Page Header */}
      <h3 className="mb-6 text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
        Messages Feed
      </h3>

      {/* Filter Section */}
      <div className="mb-6 flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700">Filter: </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="All">All</option>
          <option value="Seen">Seen</option>
          <option value="Unseen">Unseen</option>
        </select>
      </div>

      {/* Messages Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-xs md:text-sm">
              <th className="py-3 px-6 text-left">Sr.No</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Company</th>
              <th className="py-3 px-6 text-left">Date/Time</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-xs md:text-sm font-light">
            {displayedMessages.length > 0 ? (
              displayedMessages
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((message, index) => {
                  const messageDate = new Date(message.createdAt);
                  const today = new Date();
                  const isToday =
                    messageDate.toDateString() === today.toDateString();

                  return (
                    <tr
                      key={message._id}
                      className={`border-b border-gray-200 hover:bg-gray-100 cursor-pointer ${
                        message.seenstatus ? "bg-white" : "bg-gray-200"
                      }`}
                      onClick={() => handleRowClick(message)}
                    >
                      <td className="py-3 px-6 text-left">
                        {index + 1 + (currentPage - 1) * PAGE_SIZE}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {message.FirstName} {message.LastName}
                      </td>
                      <td className="py-3 px-6 text-left">{message.Email}</td>
                      <td className="py-3 px-6 text-left">{message.PhoneNo}</td>
                      <td className="py-3 px-6 text-left">
                        {message.CompanyName}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {isToday
                          ? messageDate.toLocaleTimeString()
                          : `${messageDate.toLocaleDateString()} ${messageDate.toLocaleTimeString()}`}
                      </td>
                      <td className="py-3 px-6 text-left">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markread(message);
                          }}
                          className={`w-24 px-3 py-1 rounded-md text-xs md:text-sm shadow-sm transition-colors duration-200 ${
                            message.seenstatus
                              ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
                              : "bg-gray-100 border border-orange-500 text-orange-500"
                          } hover:bg-opacity-90`}
                        >
                          {message.seenstatus ? "Unread" : "Read"}
                        </button>
                      </td>
                    </tr>
                  );
                })
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-3">
                  No messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
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
              { length: Math.ceil(filteredMessages.length / PAGE_SIZE) },
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
                  currentPage === Math.ceil(filteredMessages.length / PAGE_SIZE)
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

      {/* Message Modal */}
      {showModal && (
        <MessageModal message={selectedMessage} onClose={handleCloseModal} />
      )}
      <ScrollToTopButton />
    </div>
  );
}

export default Feed;
