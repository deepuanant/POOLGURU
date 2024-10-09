import React from "react";

function DeleteConfirmationModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-4">
          Are you sure you want to delete this notification?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
