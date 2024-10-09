import React from "react";
import { FaTimes } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { CiCircleCheck } from "react-icons/ci";

const steps = [
  {
    title: "File Selected",
    icon: "check",
  },
  {
    title: "Validated",
    icon: "check",
  },
  {
    title: "Processed",
    icon: "check",
  },
  {
    title: "Data Set",
    icon: "check",
  },
  {
    title: "File Uploaded",
    icon: "check",
  },
];

const StepIcon = ({ icon, isCompleted, isError }) => {
  if (isError) {
    return <MdError className="w-6 h-6 text-red-500" />; // Error icon
  }
  if (isCompleted) {
    return <CiCircleCheck className="w-6 h-6 text-green-500" />; // Check icon
  }
  return <div className="w-6 h-6 text-gray-400" />; // Placeholder for incomplete steps
};

const ProgressModal = ({ isOpen, onClose, uploadProgress, message, error }) => {
  if (!isOpen) return null;

  const currentStep = error ? error.step : uploadProgress; // Set the step correctly even on error

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded-lg shadow-2xl relative max-w-xl w-full">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-orange-500 hover:text-orange-400 transition-colors duration-300"
          aria-label="Close"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
          Progress Overview
        </h2>

        {/* Progress Steps */}
        <ol className="flex space-x-8 text-gray-500">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep; // Completed if it's before current step
            const isCurrent = index === currentStep; // Current if it matches current step
            const isError = error && error.step === index; // Error if it matches error step

            return (
              <li
                key={step.title}
                className="relative flex flex-col items-center"
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full ring-4 ring-white ${
                    isCompleted ? "bg-green-200" : "bg-gray-100"
                  } mb-2`}
                >
                  <StepIcon
                    icon={step.icon}
                    isCompleted={isCompleted}
                    isError={isError}
                  />
                </span>
                <h3
                  className={`font-medium leading-tight ${
                    isCurrent ? "text-blue-600" : ""
                  }`}
                >
                  {step.title}
                </h3>
              </li>
            );
          })}
        </ol>

        {/* Status Message */}
        {!error && (
          <div className="mt-4 text-gray-700">
            <p>Status: {message}</p>
          </div>
        )}
        {error && (
          <div className="mt-4 text-red-500">
            <p>{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressModal;
