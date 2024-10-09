import React from "react";
import { FaTimes } from "react-icons/fa";
import Accordion from "./Accordion";

const ModalforBatches = ({ isOpen, onClose, message, accordionData }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-2xl relative w-full max-w-screen-sm mx-4 sm:mx-8 md:mx-16 lg:mx-auto max-h-[80vh] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-orange-500 hover:text-orange-400 transition-colors duration-300 transition-transform transform hover:scale-110"
          aria-label="Close"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
          {message}
        </h2>
        <div className="max-h-[60vh] overflow-y-scroll no-scrollbar">
          <Accordion data={accordionData} />
        </div>
      </div>
    </div>
  );
};

export default ModalforBatches;
