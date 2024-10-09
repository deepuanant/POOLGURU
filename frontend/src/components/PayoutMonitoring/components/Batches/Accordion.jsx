import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaCheck, FaTimes } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { deleteSingleBatchById } from "../../../../api/servicesapi";
import { toast } from "react-hot-toast";

const Accordion = ({ data: initialData }) => {
  const [data, setData] = useState(initialData);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggle = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const getStatus = (status) => {
    const statusInfo = {
      success: {
        icon: <FaCheckCircle className="text-green-500" />,
        text: "Completed",
        color: "bg-gradient-to-r from-green-400 to-green-600",
      },
      failed: {
        icon: <FaTimesCircle className="text-red-500" />,
        text: "Failed",
        color: "bg-red-500",
      },
      pending: {
        icon: <FaHourglassHalf className="text-yellow-500" />,
        text: "Pending",
        color: "bg-gray-300",
      },
    };
    return statusInfo[status] || { icon: null, text: "Unknown", color: "bg-gray-300" };
  };

  const getOverallStatus = (steps) => {
    if (steps.some((step) => step.status === "failed")) {
      return "failed";
    }
    if (steps.every((step) => step.status === "success")) {
      return "success";
    }
    return "pending";
  };

  const handleDelete = async (id) => {
    try {
      await deleteSingleBatchById(id);
      setData((prevData) => prevData.filter((item) => item.id !== id));
      toast.success("Batch deleted successfully");
    } catch (error) {
      console.error("Failed to delete batch", error);
    }
  };

  return (
    <div className="w-full max-w-screen-md mx-auto bg-white shadow-lg rounded-lg">
      {data.map((item, index) => {
        const overallStatus = getOverallStatus(item.steps);
        const { icon, text } = getStatus(overallStatus);
        const isActive = activeIndex === index;

        if (isMobile) {
          return (
            <div key={index} className="border-b border-gray-200">
              <h2 id={`accordion-heading-mobile-${index}`}>
                <button
                  type="button"
                  className={`flex items-center justify-between w-full p-5 font-medium text-gray-500 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:ring-gray-200 transition-all duration-300 ${
                    isActive ? "rounded-t-lg shadow-md" : ""
                  }`}
                  onClick={() => handleToggle(index)}
                  aria-expanded={isActive}
                  aria-controls={`accordion-body-mobile-${index}`}
                >
                  <span className="flex items-center gap-2">
                    {icon}
                    {item.title}
                  </span>
                  <svg
                    className={`w-3 h-3 ml-4 transform transition-transform duration-200 ${
                      isActive ? "" : "rotate-180"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5L5 1 1 5" />
                  </svg>
                  <div
                    role="button"
                    tabIndex={0}
                    className="ml-4 text-red-500 hover:text-red-700 transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                  >
                    <FiTrash className="text-orange-500 hover:text-orange-700 transition duration-300 size-4" size={20} />
                  </div>
                </button>
              </h2>
              <div
                id={`accordion-body-mobile-${index}`}
                className={`p-5 bg-white border border-gray-200 ${isActive ? "block" : "hidden"} rounded-b-lg`}
                aria-labelledby={`accordion-heading-mobile-${index}`}
              >
                <ol className="relative text-gray-500 border-l border-gray-200 dark:border-gray-700 dark:text-gray-400">
                  {item.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="mb-10 pl-6">
                      <span
                        className={`absolute flex items-center justify-center w-8 h-8 ${
                          step.status === "success" ? "bg-green-200" : "bg-gray-100"
                        } rounded-full -left-4 ring-4 ring-white dark:ring-gray-900`}
                      >
                        {step.status === "success" ? (
                          <FaCheck className="text-green-500" />
                        ) : step.status === "failed" ? (
                          <FaTimes className="text-red-500" />
                        ) : (
                          <span>{stepIndex + 1}</span>
                        )}
                      </span>
                      <h3 className="font-medium">{step.label}</h3>
                      <p className="text-sm">Step details here</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          );
        }

        return (
          <div key={index} className="border-b border-gray-200">
            <h2 id={`accordion-heading-${index}`}>
              <button
                type="button"
                className={`flex items-center justify-between w-full p-5 font-medium text-gray-500 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:ring-gray-200 transition-all duration-300 ${
                  isActive ? "rounded-t-lg shadow-md" : ""
                }`}
                onClick={() => handleToggle(index)}
                aria-expanded={isActive}
                aria-controls={`accordion-body-${index}`}
              >
                <span className="flex items-center gap-2">
                  {icon}
                  {item.title}
                </span>
                <span className="text-sm text-gray-500 ml-2">Status: {text}</span>
                <svg
                  className={`w-3 h-3 ml-4 transform transition-transform duration-200 ${
                    isActive ? "" : "rotate-180"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5L5 1 1 5" />
                </svg>
                <div
                  role="button"
                  tabIndex={0}
                  className="ml-4 text-red-500 hover:text-red-700 transition-colors duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                >
                  <FiTrash className="text-orange-500 hover:text-orange-700 transition duration-300 size-4" size={20} />
                </div>
              </button>
            </h2>
            <div
              id={`accordion-body-${index}`}
              className={`p-5 bg-white border border-gray-200 ${isActive ? "block" : "hidden"} rounded-b-lg`}
              aria-labelledby={`accordion-heading-${index}`}
            >
              <div className="relative mb-8 mt-6">
                <div className="relative bg-gray-200 h-1 rounded-full flex">
                  {item.steps.map((step, stepIndex) => {
                    const stepWidth = 100 / item.steps.length;
                    const stepColor =
                      step.status === "success"
                        ? "bg-green-500"
                        : step.status === "failed"
                        ? "bg-red-500"
                        : "bg-gray-300";
                    return <div key={stepIndex} className={`h-1 ${stepColor}`} style={{ width: `${stepWidth}%` }} />;
                  })}
                </div>
                <div className="absolute inset-0 top-3 flex items-center justify-between">
                  {item.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex flex-col items-center flex-1">
                      <div
                        role="button"
                        tabIndex={0}
                        className={`${
                          step.status === "success"
                            ? "bg-gradient-to-r from-green-500 to-green-600"
                            : step.status === "failed"
                            ? "bg-red-500"
                            : "bg-gray-300"
                        } text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md`}
                      >
                        {step.status === "success" ? <FaCheck size={14} /> : step.status === "failed" ? <FaTimes size={14} /> : stepIndex + 1}
                      </div>
                      <span className="mt-1 text-xs text-gray-600">{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
