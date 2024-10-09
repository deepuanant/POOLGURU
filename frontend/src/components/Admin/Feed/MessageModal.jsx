import React from "react";

const MessageModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">
          Subject: {message.Subject}
        </h4>
        <p className="text-gray-600 mb-4">{message.Message}</p>
        <div className="mt-2 text-sm text-gray-500 space-y-1">
          <p>
            <strong>Name:</strong> {message.FirstName} {message.LastName}
          </p>
          <p>
            <strong>Email:</strong> {message.Email}
          </p>
          <p>
            <strong>Phone:</strong> {message.PhoneNo}
          </p>
          <p>
            <strong>Company:</strong> {message.CompanyName}
          </p>
          <p>
            <strong>Job Title:</strong> {message.JobTitle}
          </p>
          <p>
            <strong>Annual Revenue:</strong> {message.AnnualRevenue}
          </p>
          <p>
            <strong>Company Size:</strong> {message.CompanySize}
          </p>
        </div>
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MessageModal;
