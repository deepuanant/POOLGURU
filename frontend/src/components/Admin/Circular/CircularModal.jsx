import React, { useState, useEffect } from "react";

function CircularModal({ circular, onClose, onSave }) {
  const [title, setTitle] = useState(circular.title);
  const [message, setMessage] = useState(circular.message);

  useEffect(() => {
    setTitle(circular.title);
    setMessage(circular.message);
  }, [circular]);

  const handleSave = () => {
    onSave({ ...circular, title, message });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Update Circular</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Save
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

export default CircularModal;
