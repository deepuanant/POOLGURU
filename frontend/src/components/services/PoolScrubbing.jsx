import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaShieldAlt,
  FaUsers,
  FaClipboardList,
  FaChartLine,
  FaCogs,
} from "react-icons/fa";
import { fadeIn, bounce } from "../common/FadeIn";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

// Define parent animation to stagger the children (cards) smoothly
const containerVariants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
      ease: "easeInOut", // Added ease for smoother transition
    },
  },
};

const PoolScrubbing = () => {
  const ref = useRef(null);

  // Adjust threshold to be more sensitive to visibility changes
  const isInView = useIntersectionObserver(ref, {
    threshold: [0.1, 0.25, 0.5],
  });

  const sections = [
    {
      icon: <FaShieldAlt size={32} className="text-orange-500 mb-4" />,
      title: "Data Cleansing & Verification",
      items: ["Identify Issues", "Validate Accuracy", "Standardize Data"],
    },
    {
      icon: <FaClipboardList size={32} className="text-yellow-500 mb-4" />,
      title: "Loan Eligibility & Compliance",
      items: ["Eligibility Criteria", "Compliance Check", "Risk Assessment"],
    },
    {
      icon: <FaUsers size={32} className="text-orange-600 mb-4" />,
      title: "Borrower Evaluation",
      items: ["Creditworthiness", "Collateral Appraisal", "Due Diligence"],
    },
    {
      icon: <FaChartLine size={32} className="text-yellow-600 mb-4" />,
      title: "Portfolio Review",
      items: ["Asset Quality", "Portfolio Segmentation", "Data Accuracy"],
    },
  ];

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={containerVariants}
      className="bg-white text-gray-900 p-6"
    >
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1
          variants={bounce}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center justify-center text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500"
        >
          <span className="mr-3 p-1 rounded-full border border-orange-500 flex items-center justify-center">
            <FaCogs className="text-3xl text-orange-500 dark:text-orange-400" />
          </span>
          Pool Scrubbing
        </motion.h1>
        <motion.p
          variants={fadeIn("up", 0.4)}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="text-base md:text-lg mb-8 text-gray-700"
        >
          Ensuring data integrity and compliance for your pool portfolios.
        </motion.p>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              {section.icon}
              <motion.h2
                variants={fadeIn("up", 0.2)}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-lg font-semibold mb-3 hover:text-orange-600 cursor-pointer"
              >
                {section.title}
              </motion.h2>
              <ul className="space-y-2 text-sm md:text-base text-gray-700">
                {section.items.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-left">
                    <FaCheckCircle
                      className={`text-${index % 2 === 0 ? "orange" : "yellow"}-500 mr-2`}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PoolScrubbing;
