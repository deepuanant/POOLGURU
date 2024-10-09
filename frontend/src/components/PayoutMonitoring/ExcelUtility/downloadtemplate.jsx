import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const DownloadTemplate = ({
  startDate,
  endDate,
  partpaydate,
  setStartDate,
  setEndDate,
  setPartpaydate,
  handleSubmit,
  processExcel,
  onClose,
}) => {
  const modalRef = useRef();
  const [isHovering, setIsHovering] = useState(false);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleDownloadClick = (e) => {
    e.preventDefault();
    processExcel(startDate, endDate, partpaydate);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-sm mt-16 z-50"
      onClick={handleClickOutside}
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`bg-white p-8 rounded-2xl shadow-2xl w-11/12 md:w-1/2 lg:w-1/3 z-50 relative ${
          isHovering ? 'ring-4 ring-orange-300' : ''
        } transition-all duration-300`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute top-4 right-4 ${
            isHovering ? 'text-orange-500' : 'text-gray-500'
          } hover:text-orange-500 transition-colors duration-200`}
          onClick={onClose}
        >
          <IoClose size={28} />
        </motion.button>
        <h2 className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${
          isHovering ? 'from-orange-600 to-yellow-600' : 'from-orange-500 to-yellow-500'
        } mb-8 transition-all duration-300`}>
          Select Date Range
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <DateInput
            label="Date of Disbursement"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            type="date"
            isHovering={isHovering}
          />
          <DateInput
            label="Collection Month"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            type="month"
            isHovering={isHovering}
          />
          <DateInput
            label="Part Payment Date"
            value={partpaydate}
            onChange={(e) => setPartpaydate(e.target.value)}
            type="date"
            isHovering={isHovering}
          />
          <motion.div
            className="flex justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="#"
              onClick={handleDownloadClick}
              className={`w-full text-center text-white bg-gradient-to-r ${
                isHovering ? 'from-orange-600 to-yellow-600' : 'from-orange-500 to-yellow-500'
              } hover:from-orange-600 hover:to-yellow-600 focus:ring-4 focus:ring-orange-200 font-medium rounded-lg text-lg px-6 py-3 transition-all duration-300 shadow-lg hover:shadow-xl`}
            >
              Download Template
            </Link>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const DateInput = ({ label, value, onChange, type, isHovering }) => (
  <div className="relative">
    <label className={`block ${isHovering ? 'text-orange-600' : 'text-gray-700'} mb-2 font-medium transition-colors duration-300`}>
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`border-2 ${
          isHovering ? 'border-orange-300' : 'border-gray-300'
        } rounded-lg w-full p-3 pl-12 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300`}
        required
      />
      <FaCalendarAlt className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
        isHovering ? 'text-orange-400' : 'text-gray-400'
      } text-xl transition-colors duration-300`} />
    </div>
  </div>
);

export default DownloadTemplate;
