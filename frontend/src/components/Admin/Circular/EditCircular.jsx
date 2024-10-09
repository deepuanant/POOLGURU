import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CircularModal from "./CircularModal";
import ScrollToTopButton from "../../miscellaneous/ScrollToTopButton";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import {
  getCircular,
  updateCircular,
  deleteCircular,
} from "../../../api/adminapi";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const PAGE_SIZE = 5;

function CircularFeed() {
  const [circulars, setCirculars] = useState([]);
  const [selectedCircular, setSelectedCircular] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCirculars = async () => {
      try {
        const response = await getCircular();
        setCirculars(response.data);
      } catch (error) {
        console.error("Error fetching circulars:", error);
      }
    };

    fetchCirculars();
  }, [showUpdateModal, showDeleteModal]);

  const handleUpdateClick = (circular) => {
    setSelectedCircular(circular);
    setShowUpdateModal(true);
  };

  const handleDeleteClick = (circular) => {
    setSelectedCircular(circular);
    setShowDeleteModal(true);
  };

  const handleUpdate = async (updatedCircular) => {
    try {
      const response = await updateCircular(
        updatedCircular._id,
        updatedCircular
      );
      if (response.status === 200) {
        setCirculars(
          circulars.map((circ) =>
            circ._id === updatedCircular._id ? updatedCircular : circ
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
      const response = await deleteCircular(selectedCircular._id);
      if (response.status === 200) {
        setCirculars(
          circulars.filter((circ) => circ._id !== selectedCircular._id)
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
    setSelectedCircular(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedCircular(null);
  };

  const filteredCirculars = circulars.filter((circular) => {
    return true;
  });

  const displayedCirculars =
    currentPage === 1
      ? filteredCirculars.slice(0, PAGE_SIZE)
      : filteredCirculars.slice(
          (currentPage - 1) * PAGE_SIZE,
          currentPage * PAGE_SIZE
        );

  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(filteredCirculars.length / PAGE_SIZE)
    ) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-5">
          <h3 className="mb-8 text-2xl text-center font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
            Circulars Feed
          </h3>

          {/* Circulars Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">S.No</th>
                  <th className="py-3 px-6 text-left">Title</th>
                  <th className="py-3 px-6 text-left">Message</th>
                  <th className="py-3 px-6 text-left">Date/Time</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {displayedCirculars.length > 0 ? (
                  displayedCirculars
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((circular, index) => {
                      const circularDate = new Date(circular.createdAt);
                      const today = new Date();
                      const isToday =
                        circularDate.toDateString() === today.toDateString();

                      return (
                        <tr
                          key={circular._id}
                          className={`border-b border-gray-200 hover:bg-gray-50 ${
                            circular.read ? "bg-white" : "bg-gray-100"
                          }`}
                        >
                          <td className="py-3 px-6 text-left whitespace-nowrap">
                            {index + 1 + (currentPage - 1) * PAGE_SIZE}
                          </td>
                          <td className="py-3 px-6 text-left whitespace-nowrap">
                            {circular.title}
                          </td>
                          <td className="py-3 px-6 text-left">
                            {circular.message}
                          </td>
                          <td className="py-3 px-6 text-left">
                            {isToday
                              ? circularDate.toLocaleTimeString()
                              : `${circularDate.toLocaleDateString()} ${circularDate.toLocaleTimeString()}`}
                          </td>
                          <td className="py-3 px-6 text-xl text-left flex space-x-2">
                            <button
                              onClick={() => handleUpdateClick(circular)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(circular)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrashAlt />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-3">
                      No circulars found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-8">
            <nav aria-label="Page navigation">
              <ul className="inline-flex space-x-1 text-base h-10">
                {/* Previous Button */}
                <li>
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                    className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Previous
                  </Link>
                </li>

                {/* Dynamic Page Numbers */}
                {Array.from(
                  { length: Math.ceil(filteredCirculars.length / PAGE_SIZE) },
                  (_, pageIndex) => (
                    <li key={pageIndex}>
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageIndex + 1);
                        }}
                        className={`flex items-center justify-center px-4 h-10 leading-tight ${
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

                {/* Next Button */}
                <li>
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                    className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 ${
                      currentPage ===
                      Math.ceil(filteredCirculars.length / PAGE_SIZE)
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
        </div>

        {/* Modals */}
        {showUpdateModal && (
          <CircularModal
            circular={selectedCircular}
            onClose={handleCloseUpdateModal}
            onSave={handleUpdate}
          />
        )}

        {showDeleteModal && (
          <DeleteConfirmationModal
            onClose={handleCloseDeleteModal}
            onConfirm={handleDelete}
          />
        )}

        <ScrollToTopButton />
      </div>
    </div>
  );
}

export default CircularFeed;
